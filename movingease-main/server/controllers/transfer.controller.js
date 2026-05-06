import Transfer from "../models/Transfer.js";
import Booking from "../models/Booking.js";
import { apiResponse } from "../utils/response.js";

export async function submitTransfer(req, res, next) {
  try {
    const { bookingId, amount, transferReference, transferDate, transferMethod, senderName } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    if (!req.file) return apiResponse(res, 400, false, null, "Receipt image is required");

    const transfer = await Transfer.create({
      booking: booking._id,
      customer: booking.customer,
      customerSnapshot: booking.customerSnapshot,
      amount: Number(amount),
      transferReference,
      transferDate,
      transferMethod,
      senderName,
      receiptImageUrl: `uploaded://${req.file.originalname}`
    });

    booking.transfer = transfer._id;
    booking.paymentStatus = "receipt_submitted";
    await booking.save();

    return apiResponse(res, 201, true, transfer, "Transfer submitted");
  } catch (e) { next(e); }
}

export async function myTransfers(req, res, next) {
  try {
    const data = await Transfer.find({ customer: req.user._id }).populate("booking", "bookingRef pricing paymentStatus").sort({ createdAt: -1 });
    return apiResponse(res, 200, true, data, "Transfers fetched");
  } catch (e) { next(e); }
}

export async function getTransfer(req, res, next) {
  try {
    const transfer = await Transfer.findById(req.params.id).populate("booking customer", "bookingRef email firstName lastName phone");
    if (!transfer) return apiResponse(res, 404, false, null, "Transfer not found");
    if (req.user.role !== "admin" && String(transfer.customer._id) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");
    return apiResponse(res, 200, true, transfer, "Transfer fetched");
  } catch (e) { next(e); }
}

export async function resubmitTransfer(req, res, next) {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return apiResponse(res, 404, false, null, "Transfer not found");
    if (String(transfer.customer) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");
    if (transfer.status !== "rejected") return apiResponse(res, 400, false, null, "Only rejected transfers can be resubmitted");

    transfer.transferReference = req.body.transferReference || transfer.transferReference;
    transfer.senderName = req.body.senderName || transfer.senderName;
    transfer.transferDate = req.body.transferDate || transfer.transferDate;
    transfer.transferMethod = req.body.transferMethod || transfer.transferMethod;
    if (req.file) transfer.receiptImageUrl = `uploaded://${req.file.originalname}`;
    transfer.status = "pending";
    transfer.adminNote = undefined;
    transfer.reviewedAt = undefined;
    transfer.reviewedBy = undefined;
    await transfer.save();

    await Booking.findByIdAndUpdate(transfer.booking, { paymentStatus: "receipt_submitted" });
    return apiResponse(res, 200, true, transfer, "Transfer resubmitted");
  } catch (e) { next(e); }
}
