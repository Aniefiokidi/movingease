import { io } from "../server.js";

export function emitBookingStatusUpdate(booking) {
  io.to(`user:${booking.customer}`).emit("booking:status", { bookingId: booking._id, status: booking.status, paymentStatus: booking.paymentStatus });
}
