import dayjs from "dayjs";
import Booking from "../models/Booking.js";
import { generateBookingRef } from "../utils/helpers.js";
import { apiResponse } from "../utils/response.js";
import { calculatePrice } from "../services/pricing.service.js";
import { emailTemplate, sendEmail } from "../services/notification.service.js";

function snapshotFromPayload(snapshot = {}) {
  return {
    firstName: snapshot.firstName,
    lastName: snapshot.lastName,
    email: snapshot.email,
    phone: snapshot.phone,
    dateOfBirth: snapshot.dateOfBirth,
    governmentIdType: snapshot.governmentIdType,
    governmentIdNumber: snapshot.governmentIdNumber,
    address: snapshot.address,
    emergencyContact: snapshot.emergencyContact
  };
}

export async function createBooking(req, res, next) {
  try {
    const pricing = await calculatePrice(req.body);
    const booking = await Booking.create({
      ...req.body,
      bookingRef: generateBookingRef(),
      customer: req.user?._id,
      customerSnapshot: snapshotFromPayload(req.body.customerSnapshot || {}),
      pricing,
      status: "quote",
      quoteExpiresAt: dayjs().add(48, "hour").toDate(),
      statusHistory: [{ status: "quote", timestamp: new Date(), note: "Booking request submitted", updatedBy: "public" }]
    });

    const selectedItems = Array.isArray(booking.selectedItems)
      ? booking.selectedItems.map((item) => `${item.label} x${item.quantity}`).join(", ")
      : "No items provided";

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Booking Request ${booking.bookingRef}`,
        html: emailTemplate(
          "New Booking Request",
          `<p><strong>Customer:</strong> ${booking.customerSnapshot?.firstName || ""} ${booking.customerSnapshot?.lastName || ""}</p>
           <p><strong>Phone:</strong> ${booking.customerSnapshot?.phone || "N/A"}</p>
           <p><strong>Pickup:</strong> ${booking.pickup?.address || "N/A"}</p>
           <p><strong>Dropoff:</strong> ${booking.dropoff?.address || "N/A"}</p>
           <p><strong>Items:</strong> ${selectedItems}</p>
           <p><strong>Estimated Price:</strong> CAD $${((booking.pricing?.totalEstimate || 0) / 100).toFixed(2)}</p>`
        )
      });
    }

    return apiResponse(res, 201, true, booking, "Booking request submitted");
  } catch (e) { next(e); }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).sort({ createdAt: -1 });
    return apiResponse(res, 200, true, bookings, "Bookings fetched");
  } catch (e) { next(e); }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("transfer review assignedMovers");
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    return apiResponse(res, 200, true, booking, "Booking fetched");
  } catch (e) { next(e); }
}

export async function confirmBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    if (String(booking.customer) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");
    booking.status = "confirmed";
    booking.statusHistory.push({ status: "confirmed", timestamp: new Date(), note: "Customer confirmed", updatedBy: String(req.user._id) });
    await booking.save();
    return apiResponse(res, 200, true, booking, "Booking confirmed");
  } catch (e) { next(e); }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    if (String(booking.customer) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");

    const within48h = dayjs(booking.moveDate).diff(dayjs(), "hour") < 48;
    booking.status = "cancelled";
    booking.cancellationReason = req.body.reason;
    booking.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: within48h ? "Cancelled within 48 hours (25% charge applies)" : "Free cancellation",
      updatedBy: String(req.user._id)
    });
    await booking.save();
    return apiResponse(res, 200, true, { booking, policyChargePercent: within48h ? 25 : 0 }, "Booking cancelled");
  } catch (e) { next(e); }
}

export async function uploadBookingPhotos(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    if (String(booking.customer) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");
    const urls = (req.files || []).map((f) => `uploaded://${f.originalname}`);
    booking.itemPhotos = [...(booking.itemPhotos || []), ...urls].slice(0, 10);
    await booking.save();
    return apiResponse(res, 200, true, booking, "Photos uploaded");
  } catch (e) { next(e); }
}
