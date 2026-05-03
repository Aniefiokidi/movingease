import mongoose from "mongoose";

const pricingConfigSchema = new mongoose.Schema({
  basePrice: { type: Number, default: 15000 },
  distanceRatePerKm: { type: Number, default: 250 },
  laborRatePerWorker: { type: Number, default: 5000 },
  truckRates: {
    van: { type: Number, default: 7500 },
    medium: { type: Number, default: 12500 },
    large: { type: Number, default: 20000 }
  },
  urgencyRates: {
    standard: { type: Number, default: 0 },
    same_day: { type: Number, default: 10000 },
    express: { type: Number, default: 20000 }
  },
  floorSurchargePerFloor: { type: Number, default: 2500 },
  noElevatorSurcharge: { type: Number, default: 5000 },
  narrowStairsSurcharge: { type: Number, default: 4000 },
  farParkingSurcharge: { type: Number, default: 3000 },
  fragileSurcharge: { type: Number, default: 7500 },
  currency: { type: String, default: "CAD" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("PricingConfig", pricingConfigSchema);
