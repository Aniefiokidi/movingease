import api from "./api";

export const createBooking = (payload) => api.post("/bookings", payload);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getAdminBookings = (params = {}) => api.get("/admin/bookings", { params });
