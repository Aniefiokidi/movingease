import dayjs from "dayjs";
import Booking from "../models/Booking.js";
import Transfer from "../models/Transfer.js";
import User from "../models/User.js";
import Mover from "../models/Mover.js";
import PricingConfig from "../models/PricingConfig.js";
import BankSettings from "../models/BankSettings.js";
import AuditLog from "../models/AuditLog.js";
import { apiResponse } from "../utils/response.js";
import { decryptText, maskId } from "../utils/encryption.js";

export async function getAllBookings(req, res, next) {
  try {
    const { status, serviceType, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (q) filter.$or = [{ bookingRef: { $regex: q, $options: "i" } }, { "customerSnapshot.firstName": { $regex: q, $options: "i" } }, { "customerSnapshot.lastName": { $regex: q, $options: "i" } }];
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return apiResponse(res, 200, true, bookings, "Admin bookings");
  } catch (e) { next(e); }
}

export async function updateBookingAdmin(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");

    const allowed = ["status", "adminNotes", "pricing"];
    for (const key of allowed) if (req.body[key] !== undefined) booking[key] = req.body[key];

    if (req.body.status) booking.statusHistory.push({ status: req.body.status, timestamp: new Date(), note: req.body.note || "Status updated by admin", updatedBy: String(req.user._id) });
    if (req.body.pricing?.finalPrice && req.body.overrideReason) booking.statusHistory.push({ status: booking.status, timestamp: new Date(), note: `Price override: ${req.body.overrideReason}`, updatedBy: String(req.user._id) });

    await booking.save();
    return apiResponse(res, 200, true, booking, "Booking updated");
  } catch (e) { next(e); }
}

export async function assignMovers(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    const moverIds = req.body.moverIds || [];

    const conflicts = [];
    for (const moverId of moverIds) {
      const hasConflict = await Booking.findOne({ assignedMovers: moverId, moveDate: booking.moveDate, preferredTime: booking.preferredTime, status: { $in: ["confirmed", "assigned", "in_progress"] } });
      if (hasConflict) conflicts.push(moverId);
    }

    booking.assignedMovers = moverIds;
    booking.status = "assigned";
    booking.statusHistory.push({ status: "assigned", timestamp: new Date(), note: "Movers assigned", updatedBy: String(req.user._id) });
    await booking.save();

    await Mover.updateMany({ _id: { $in: moverIds } }, { $addToSet: { assignedBookings: booking._id } });
    return apiResponse(res, 200, true, { booking, conflicts }, "Movers assignment updated");
  } catch (e) { next(e); }
}

export async function getTransfers(req, res, next) {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const transfers = await Transfer.find(filter).populate("booking customer reviewedBy").sort({ createdAt: -1 });
    const flagged = transfers.map((t) => {
      const bookingTotal = t.booking?.pricing?.finalPrice || 0;
      const mismatch = Math.abs((t.amount || 0) - bookingTotal) > 500;
      return { ...t.toObject(), mismatchAlert: mismatch };
    });
    return apiResponse(res, 200, true, flagged, "Admin transfers");
  } catch (e) { next(e); }
}

export async function getTransferById(req, res, next) {
  try {
    const transfer = await Transfer.findById(req.params.id).populate("booking customer reviewedBy");
    if (!transfer) return apiResponse(res, 404, false, null, "Transfer not found");
    return apiResponse(res, 200, true, transfer, "Transfer fetched");
  } catch (e) { next(e); }
}

export async function approveTransfer(req, res, next) {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return apiResponse(res, 404, false, null, "Transfer not found");
    transfer.status = "approved";
    transfer.reviewedBy = req.user._id;
    transfer.reviewedAt = new Date();
    transfer.adminNote = req.body.note;
    await transfer.save();
    await Booking.findByIdAndUpdate(transfer.booking, { paymentStatus: "verified" });
    return apiResponse(res, 200, true, transfer, "Transfer approved");
  } catch (e) { next(e); }
}

export async function rejectTransfer(req, res, next) {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return apiResponse(res, 404, false, null, "Transfer not found");
    transfer.status = "rejected";
    transfer.adminNote = req.body.reason;
    transfer.reviewedBy = req.user._id;
    transfer.reviewedAt = new Date();
    await transfer.save();
    await Booking.findByIdAndUpdate(transfer.booking, { paymentStatus: "rejected" });
    return apiResponse(res, 200, true, transfer, "Transfer rejected");
  } catch (e) { next(e); }
}

export async function getCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 });
    return apiResponse(res, 200, true, customers, "Customers");
  } catch (e) { next(e); }
}

export async function getCustomerById(req, res, next) {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return apiResponse(res, 404, false, null, "Customer not found");
    const bookings = await Booking.find({ customer: customer._id });
    const transfers = await Transfer.find({ customer: customer._id });
    return apiResponse(res, 200, true, { customer, bookings, transfers }, "Customer profile");
  } catch (e) { next(e); }
}

export async function revealCustomerId(req, res, next) {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return apiResponse(res, 404, false, null, "Customer not found");
    const plain = decryptText(customer.governmentIdNumber);
    await AuditLog.create({ admin: req.user._id, customer: customer._id, action: "REVEAL_GOV_ID" });
    return apiResponse(res, 200, true, { type: customer.governmentIdType, masked: maskId(plain), value: plain }, "ID revealed");
  } catch (e) { next(e); }
}

export async function getMovers(req, res, next) {
  try {
    const movers = await Mover.find().populate("user assignedBookings");
    return apiResponse(res, 200, true, movers, "Movers");
  } catch (e) { next(e); }
}

export async function createMover(req, res, next) {
  try {
    const mover = await Mover.create(req.body);
    return apiResponse(res, 201, true, mover, "Mover created");
  } catch (e) { next(e); }
}

export async function updateMover(req, res, next) {
  try {
    const mover = await Mover.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mover) return apiResponse(res, 404, false, null, "Mover not found");
    return apiResponse(res, 200, true, mover, "Mover updated");
  } catch (e) { next(e); }
}

export async function getPricing(req, res, next) {
  try {
    let pricing = await PricingConfig.findOne().sort({ updatedAt: -1 });
    if (!pricing) pricing = await PricingConfig.create({});
    return apiResponse(res, 200, true, pricing, "Pricing config");
  } catch (e) { next(e); }
}

export async function updatePricing(req, res, next) {
  try {
    let pricing = await PricingConfig.findOne().sort({ updatedAt: -1 });
    if (!pricing) pricing = await PricingConfig.create({});
    Object.assign(pricing, req.body, { updatedBy: req.user._id });
    await pricing.save();
    return apiResponse(res, 200, true, pricing, "Pricing updated");
  } catch (e) { next(e); }
}

export async function getBankDetails(_req, res, next) {
  try {
    let settings = await BankSettings.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      settings = await BankSettings.create({
        accountName: process.env.BANK_ACCOUNT_NAME,
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        bankName: process.env.BANK_NAME,
        etransferEmail: process.env.BANK_ETRANSFER_EMAIL
      });
    }
    return apiResponse(res, 200, true, settings, "Bank details");
  } catch (e) { next(e); }
}

export async function updateBankDetails(req, res, next) {
  try {
    let settings = await BankSettings.findOne().sort({ updatedAt: -1 });
    if (!settings) settings = await BankSettings.create({});
    Object.assign(settings, req.body, { updatedBy: req.user._id });
    await settings.save();
    return apiResponse(res, 200, true, settings, "Bank details updated");
  } catch (e) { next(e); }
}

export async function getStats(_req, res, next) {
  try {
    const [todayBookings, pendingReceipts, verifiedPayments, activeMoves] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: dayjs().startOf("day").toDate() } }),
      Transfer.countDocuments({ status: "pending" }),
      Booking.countDocuments({ paymentStatus: "verified" }),
      Booking.countDocuments({ status: { $in: ["confirmed", "assigned", "in_progress"] } })
    ]);

    return apiResponse(res, 200, true, { todayBookings, pendingReceipts, verifiedPayments, activeMoves }, "Stats");
  } catch (e) { next(e); }
}
