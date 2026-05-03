import mongoose from "mongoose";

const moverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isAvailable: { type: Boolean, default: true },
  skills: [String],
  assignedBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  rating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  phone: String,
  vehicleType: String
}, { timestamps: true });

export default mongoose.model("Mover", moverSchema);
