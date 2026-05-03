import mongoose from "mongoose";

const bankSettingsSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  bankName: String,
  etransferEmail: String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("BankSettings", bankSettingsSchema);
