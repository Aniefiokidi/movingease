import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import PricingConfig from "./models/PricingConfig.js";
import Mover from "./models/Mover.js";
import Booking from "./models/Booking.js";
import Transfer from "./models/Transfer.js";
import { encryptText } from "./utils/encryption.js";
import { generateBookingRef } from "./utils/helpers.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

await Promise.all([
  User.deleteMany({}), PricingConfig.deleteMany({}), Mover.deleteMany({}), Booking.deleteMany({}), Transfer.deleteMany({})
]);

const admin = await User.create({
  firstName: "Edge", lastName: "Admin", email: "edgemovingsolutions@gmail.com", phone: "+1 506-471-9393",
  passwordHash: await bcrypt.hash("Admin123!", 12), role: "admin", dateOfBirth: new Date("1990-01-01"),
  governmentIdType: "drivers_license", governmentIdNumber: encryptText("DL-ADMIN-123"),
  address: { street: "1 Main St", city: "Moncton", province: "NB", postalCode: "E1A 1A1", country: "Canada" },
  emergencyContact: { name: "Backup", phone: "+1 506-000-0000", relationship: "Manager" }, isVerified: true
});

await PricingConfig.create({ updatedBy: admin._id });

const movers = [];
for (let i = 1; i <= 3; i += 1) {
  const u = await User.create({
    firstName: `Mover${i}`, lastName: "Edge", email: `mover${i}@edge.local`, phone: `+1 506-000-000${i}`,
    passwordHash: await bcrypt.hash("Mover123!", 12), role: "mover", dateOfBirth: new Date("1995-01-01"),
    governmentIdType: "passport", governmentIdNumber: encryptText(`P-MOVER-${i}`),
    address: { street: "2 Main St", city: "Moncton", province: "NB", postalCode: "E1A 1A2", country: "Canada" },
    emergencyContact: { name: "HQ", phone: "+1 506-111-1111", relationship: "Employer" }, isVerified: true
  });
  movers.push(await Mover.create({ user: u._id, phone: u.phone, vehicleType: i === 1 ? "van" : i === 2 ? "medium" : "large" }));
}

for (let i = 1; i <= 5; i += 1) {
  const c = await User.create({
    firstName: `Customer${i}`, lastName: "Test", email: `customer${i}@edge.local`, phone: `+1 506-222-222${i}`,
    passwordHash: await bcrypt.hash("Customer123!", 12), role: "customer", dateOfBirth: new Date("1992-02-02"),
    governmentIdType: "provincial_id", governmentIdNumber: encryptText(`PID-${i}`),
    address: { street: "3 Main St", city: "Fredericton", province: "NB", postalCode: "E3B 1B1", country: "Canada" },
    emergencyContact: { name: "Sibling", phone: "+1 506-333-3333", relationship: "Sibling" }, isVerified: true
  });

  const b = await Booking.create({
    bookingRef: generateBookingRef(), customer: c._id,
    customerSnapshot: {
      firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, dateOfBirth: c.dateOfBirth,
      governmentIdType: c.governmentIdType, governmentIdNumber: c.governmentIdNumber, address: c.address, emergencyContact: c.emergencyContact
    },
    serviceType: "residential", pickup: { address: "A" }, dropoff: { address: "B" }, distanceKm: 12,
    truckType: "van", workersCount: 2, urgency: "standard", moveDate: new Date(), preferredTime: "Morning",
    pricing: { basePrice: 15000, distanceCost: 3000, laborCost: 10000, truckCost: 7500, urgencyCost: 0, accessibilitySurcharge: 0, fragileSurcharge: 0, discountAmount: 0, totalEstimate: 35500, finalPrice: 35500, currency: "CAD" },
    status: "confirmed", paymentStatus: i <= 3 ? "receipt_submitted" : "awaiting_transfer"
  });

  if (i <= 3) {
    const t = await Transfer.create({
      booking: b._id, customer: c._id, customerSnapshot: b.customerSnapshot, amount: 35500,
      transferReference: `ETR-${i}`, transferDate: new Date(), senderName: `${c.firstName} ${c.lastName}`,
      receiptImageUrl: `uploaded://receipt${i}.jpg`, status: "pending"
    });
    b.transfer = t._id;
    await b.save();
  }
}

console.log("Seed complete");
await mongoose.disconnect();
