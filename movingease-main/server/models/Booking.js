import mongoose from "mongoose";

const selectedItemSchema = new mongoose.Schema({
  itemKey: { type: String, required: true },
  label: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  volumeScore: { type: Number, default: 0 },
  weightScore: { type: Number, default: 0 },
  isFragile: { type: Boolean, default: false },
  isHeavy: { type: Boolean, default: false }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedMovers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mover" }],
  customerSnapshot: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    governmentIdType: String,
    governmentIdNumber: String,
    address: { street: String, city: String, province: String, postalCode: String },
    emergencyContact: { name: String, phone: String, relationship: String }
  },
  serviceType: { type: String, enum: ["residential", "office", "single_item", "furniture_moving", "junk_removal"], required: true },
  pricingMode: { type: String, enum: ["package", "custom"], default: "custom" },
  selectedPackage: { type: String },
  selectedItems: [selectedItemSchema],
  pickup: {
    address: String,
    coordinates: { lat: Number, lng: Number },
    floor: Number,
    hasElevator: Boolean,
    parkingDistance: { type: String, enum: ["close", "moderate", "far"] },
    hasNarrowStairs: Boolean
  },
  dropoff: {
    address: String,
    coordinates: { lat: Number, lng: Number },
    floor: Number,
    hasElevator: Boolean,
    parkingDistance: { type: String, enum: ["close", "moderate", "far"] },
    hasNarrowStairs: Boolean
  },
  distanceKm: Number,
  moveSize: { type: String, enum: ["small", "medium", "large", "custom"] },
  items: {
    beds: Number, sofas: Number, tables: Number, chairs: Number, boxes: Number, tvs: Number,
    fridges: Number, washingMachines: Number, pianos: Number, safes: Number, others: String
  },
  hasFragileItems: Boolean,
  estimatedWeightKg: Number,
  itemPhotos: [String],
  truckType: { type: String, enum: ["van", "medium", "large"] },
  workersCount: Number,
  urgency: { type: String, enum: ["standard", "same_day", "express"] },
  moveDate: Date,
  preferredTime: String,
  pricing: {
    basePrice: Number,
    distanceCost: Number,
    laborCost: Number,
    truckCost: Number,
    itemCost: Number,
    accessibilityFees: Number,
    urgencyCost: Number,
    heavyItemSurcharge: Number,
    accessibilitySurcharge: Number,
    fragileSurcharge: Number,
    profitBuffer: Number,
    profitMarginPercent: Number,
    discountAmount: Number,
    totalEstimate: Number,
    finalPrice: Number,
    currency: { type: String, default: "CAD" }
  },
  paymentStatus: { type: String, enum: ["awaiting_transfer", "receipt_submitted", "verified", "rejected", "refunded"], default: "awaiting_transfer" },
  transfer: { type: mongoose.Schema.Types.ObjectId, ref: "Transfer" },
  status: { type: String, enum: ["quote", "confirmed", "assigned", "in_progress", "completed", "cancelled"], default: "quote" },
  statusHistory: [{ status: String, timestamp: Date, note: String, updatedBy: String }],
  adminNotes: String,
  cancellationReason: String,
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  quoteExpiresAt: Date
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
