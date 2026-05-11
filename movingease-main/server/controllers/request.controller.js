import { apiResponse } from "../utils/response.js";
import { emailTemplate, sendEmail } from "../services/notification.service.js";

export async function submitRequest(req, res, next) {
  try {
    const { name, email, phone, pickupAddress, dropoffAddress, moveDate, serviceType, notes } = req.body;

    if (!name || !email || !phone) {
      return apiResponse(res, 400, false, null, "Name, email, and phone are required.");
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (!adminEmail) {
      return apiResponse(res, 500, false, null, "Email service is not configured. Set SMTP_USER or ADMIN_NOTIFICATION_EMAIL.");
    }

    await sendEmail({
      to: adminEmail,
      subject: `New Moving Request from ${name}`,
      html: emailTemplate(
        "New Moving Request",
        `<p><strong>Name:</strong> ${name}</p>
         <p><strong>Email:</strong> ${email}</p>
         <p><strong>Phone:</strong> ${phone}</p>
         <p><strong>Service Type:</strong> ${serviceType || "Moving request"}</p>
         <p><strong>Pickup Address:</strong> ${pickupAddress || "N/A"}</p>
         <p><strong>Dropoff Address:</strong> ${dropoffAddress || "N/A"}</p>
         <p><strong>Move Date:</strong> ${moveDate || "N/A"}</p>
         <p><strong>Notes:</strong> ${notes || "None"}</p>`
      )
    });

    return apiResponse(res, 200, true, null, "Request submitted successfully. We will follow up by email.");
  } catch (error) {
    next(error);
  }
}
