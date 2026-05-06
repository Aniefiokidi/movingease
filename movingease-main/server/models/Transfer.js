import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
  amount: { type: Number, required: true },
  currency: { type: String, default: "CAD" },
  transferReference: { type: String, required: true },
  transferDate: { type: Date, required: true },
  transferMethod: { type: String, enum: ["interac_etransfer", "bank_transfer", "cash_deposit"], default: "interac_etransfer" },
  senderName: { type: String, required: true },
  receiptImageUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  adminNote: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date
}, { timestamps: true });

export default mongoose.model("Transfer", transferSchema);
