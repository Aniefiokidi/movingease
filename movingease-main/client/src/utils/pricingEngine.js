import { PACKAGE_OPTIONS } from "./itemCatalog";

const config = {
  basePrice: 15000,
  distanceRatePerKm: 250,
  laborRatePerWorker: 5000,
  truckRates: { van: 7500, medium: 12500, large: 20000 }
};
const itemScoreRate = 900;

const roundToNearestFive = (cents) => Math.round(cents / 500) * 500;

function recommendTruck(totalVolume) {
  if (totalVolume < 10) return "van";
  if (totalVolume <= 25) return "medium";
  return "large";
}

function recommendWorkers(totalWeight) {
  if (totalWeight < 15) return 2;
  if (totalWeight <= 30) return 3;
  return 4;
}

function packageBase(selectedPackage) {
  const selected = PACKAGE_OPTIONS.find((option) => option.key === selectedPackage);
  if (!selected) return null;
  return Math.round((selected.baseMin + selected.baseMax) / 2);
}

function itemMetrics(selectedItems = []) {
  return selectedItems.reduce((acc, item) => {
    const quantity = Number(item.quantity || 0);
    acc.totalVolume += Number(item.volumeScore || 0) * quantity;
    acc.totalWeight += Number(item.weightScore || 0) * quantity;
    if (item.isFragile) acc.hasFragileItems = true;
    return acc;
  }, { totalVolume: 0, totalWeight: 0, hasFragileItems: false });
}

export function calculateLivePrice(input = {}) {
  const metrics = itemMetrics(input.selectedItems || []);
  const selectedPackage = PACKAGE_OPTIONS.find((option) => option.key === input.selectedPackage);
  const recommendedTruck = input.truckType || selectedPackage?.truckType || recommendTruck(metrics.totalVolume);
  const recommendedWorkers = input.workersCount || selectedPackage?.workersCount || recommendWorkers(metrics.totalWeight);

  const basePrice = packageBase(input.selectedPackage) || config.basePrice;
  const distanceCost = Math.round((Number(input.distanceKm) || 0) * config.distanceRatePerKm);
  const laborCost = Number(recommendedWorkers) * config.laborRatePerWorker;
  const truckCost = config.truckRates[recommendedTruck] || 0;
  const itemCost = Math.round((metrics.totalVolume + metrics.totalWeight) * itemScoreRate);
  const urgencyCost = 0;

  const floorFees = Math.max((input.pickupFloor || 0) - 1, 0) + Math.max((input.dropoffFloor || 0) - 1, 0);
  const accessibilitySurcharge =
    floorFees * 2500 +
    ((input.pickupHasElevator === false || input.dropoffHasElevator === false) ? 5000 : 0) +
    ((input.pickupHasNarrowStairs || input.dropoffHasNarrowStairs) ? 4000 : 0) +
    ((input.pickupParkingDistance === "far" || input.dropoffParkingDistance === "far") ? 3000 : 0);

  const discountAmount = Number(input.discountAmount) || 0;

  const totalEstimate = roundToNearestFive(Math.max(basePrice + distanceCost + laborCost + truckCost + itemCost + accessibilitySurcharge - discountAmount, 0));

  return {
    basePrice,
    distanceCost,
    laborCost,
    truckCost,
    itemCost,
    urgencyCost,
    accessibilitySurcharge,
    heavyItemSurcharge: 0,
    fragileSurcharge: 0,
    profitBuffer: 0,
    discountAmount,
    totalEstimate,
    display: `CAD $${(totalEstimate / 100).toFixed(2)}`,
    recommendedTruck,
    recommendedWorkers
  };
}
