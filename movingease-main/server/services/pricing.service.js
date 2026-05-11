import PricingConfig from "../models/PricingConfig.js";

const roundToNearestFive = (cents) => Math.round(cents / 500) * 500;

const packageConfig = {
  quick_move: { label: "Single Item Move", baseMin: 12000, baseMax: 15000, truckType: "van", workersCount: 2 },
  small_move: { label: "Small Move (1-5 items)", baseMin: 20000, baseMax: 25000, truckType: "van", workersCount: 2 },
  medium_move: { label: "Medium Move (6-10 items)", baseMin: 35000, baseMax: 45000, truckType: "medium", workersCount: 3 },
  full_home_move: { label: "Full Home Move", baseMin: 60000, baseMax: 80000, truckType: "large", workersCount: 4 }
};

const itemScoreRate = 900;

function getDefaultPackagePrice(key) {
  const selected = packageConfig[key];
  if (!selected) return null;
  return Math.round((selected.baseMin + selected.baseMax) / 2);
}

function getSelectedItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item && Number(item.quantity || 0) > 0);
}

function getItemMetrics(items = []) {
  return items.reduce((acc, item) => {
    const quantity = Number(item.quantity || 0);
    const volumeScore = Number(item.volumeScore || 0);
    const weightScore = Number(item.weightScore || 0);
    const key = item.itemKey;

    acc.totalVolume += volumeScore * quantity;
    acc.totalWeight += weightScore * quantity;

    if (item.isFragile) acc.hasFragileItems = true;
    return acc;
  }, {
    totalVolume: 0,
    totalWeight: 0,
    hasFragileItems: false
  });
}

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

export async function getPricingConfig() {
  let cfg = await PricingConfig.findOne().sort({ updatedAt: -1 });
  if (!cfg) cfg = await PricingConfig.create({});
  return cfg;
}

export async function calculatePrice(data) {
  const config = await getPricingConfig();
  const selectedItems = getSelectedItems(data.selectedItems);
  const itemMetrics = getItemMetrics(selectedItems);

  const packagePreset = data.pricingMode === "package" ? packageConfig[data.selectedPackage] : null;
  const packageBasePrice = data.pricingMode === "package" ? getDefaultPackagePrice(data.selectedPackage) : null;

  const resolvedTruckType = data.truckType || packagePreset?.truckType || recommendTruck(itemMetrics.totalVolume);
  const resolvedWorkersCount = data.workersCount || packagePreset?.workersCount || recommendWorkers(itemMetrics.totalWeight);

  const basePrice = packageBasePrice || config.basePrice;

  const distanceCost = Math.round((Number(data.distanceKm) || 0) * config.distanceRatePerKm);
  const laborCost = resolvedWorkersCount * config.laborRatePerWorker;
  const truckCost = config.truckRates[resolvedTruckType] || 0;
  const urgencyCost = 0;

  const floorFees = Math.max((data.pickup?.floor || 0) - 1, 0) + Math.max((data.dropoff?.floor || 0) - 1, 0);
  const accessibilitySurcharge =
    floorFees * config.floorSurchargePerFloor +
    ((data.pickup?.hasElevator === false || data.dropoff?.hasElevator === false) ? config.noElevatorSurcharge : 0) +
    ((data.pickup?.hasNarrowStairs || data.dropoff?.hasNarrowStairs) ? config.narrowStairsSurcharge : 0) +
    ((data.pickup?.parkingDistance === "far" || data.dropoff?.parkingDistance === "far") ? config.farParkingSurcharge : 0);

  const itemCost = Math.round((itemMetrics.totalVolume + itemMetrics.totalWeight) * itemScoreRate);
  const fragileSurcharge = 0;
  const discountAmount = Number(data.discountAmount) || 0;

  const subtotal = basePrice + distanceCost + laborCost + truckCost + itemCost + accessibilitySurcharge - discountAmount;
  const totalEstimate = roundToNearestFive(Math.max(subtotal, 0));

  return {
    basePrice,
    distanceCost,
    laborCost,
    truckCost,
    itemCost,
    urgencyCost,
    accessibilityFees: accessibilitySurcharge,
    accessibilitySurcharge,
    fragileSurcharge,
    heavyItemSurcharge: 0,
    profitBuffer: 0,
    profitMarginPercent: 0,
    discountAmount,
    totalEstimate, finalPrice: totalEstimate, currency: config.currency
  };
}
