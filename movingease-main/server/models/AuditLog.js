import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditLogSchema);
