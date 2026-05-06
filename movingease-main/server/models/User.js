import mongoose from "mongoose";

const savedAddressSchema = new mongoose.Schema({
  label: String,
  address: String,
  coordinates: { lat: Number, lng: Number }
}, { _id: true });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin", "mover"], default: "customer" },
  dateOfBirth: { type: Date, required: true },
  governmentIdType: { type: String, enum: ["drivers_license", "passport", "provincial_id", "health_card"], required: true },
  governmentIdNumber: { type: String, required: true },
  governmentIdPhoto: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Canada" }
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  savedAddresses: [savedAddressSchema],
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
