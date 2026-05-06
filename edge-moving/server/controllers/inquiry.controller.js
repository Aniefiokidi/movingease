import { sendEmail, emailTemplate } from "../services/notification.service.js";
import { apiResponse } from "../utils/response.js";

export async function submitInquiry(req, res, next) {
  try {
    const { name, email, phone, fromAddress, toAddress, preferredDate, propertySize, notes } = req.body;

    if (!name || !email || !phone || !fromAddress || !toAddress || !preferredDate) {
      return apiResponse(res, 400, false, null, "Please fill in all required fields.");
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const companyName = process.env.COMPANY_NAME;
    const companyPhone = process.env.COMPANY_PHONE;
    const companyEmailAddr = process.env.SMTP_USER;

    await sendEmail({
      to: adminEmail,
      subject: `New Moving Request from ${name}`,
      html: emailTemplate(
        `New Moving Request — ${name}`,
        `
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:15px">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:40%;color:#555">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#1B2A4A">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="tel:${phone}" style="color:#1B2A4A">${phone}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Moving From</td><td style="padding:10px 0;border-bottom:1px solid #eee">${fromAddress}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Moving To</td><td style="padding:10px 0;border-bottom:1px solid #eee">${toAddress}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Preferred Date</td><td style="padding:10px 0;border-bottom:1px solid #eee">${preferredDate}</td></tr>
          ${propertySize ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Property Size</td><td style="padding:10px 0;border-bottom:1px solid #eee">${propertySize}</td></tr>` : ""}
          ${notes ? `<tr><td style="padding:10px 0;font-weight:600;color:#555">Additional Notes</td><td style="padding:10px 0">${notes}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#999">Submitted via the ${companyName} website.</p>
        `
      ),
    });

    await sendEmail({
      to: email,
      subject: `We received your moving request — ${companyName}`,
      html: emailTemplate(
        `Thank you, ${name.split(" ")[0]}!`,
        `
        <p style="font-size:15px;line-height:1.6">We've received your moving request and will be in touch within <strong>24 hours</strong> to confirm your appointment and discuss the details.</p>
        <p style="font-size:15px;line-height:1.6;margin-top:16px">Here's a summary of what you submitted:</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:15px">
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:40%;color:#555">Moving From</td><td style="padding:10px 0;border-bottom:1px solid #eee">${fromAddress}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#555">Moving To</td><td style="padding:10px 0;border-bottom:1px solid #eee">${toAddress}</td></tr>
          <tr><td style="padding:10px 0;font-weight:600;color:#555">Preferred Date</td><td style="padding:10px 0">${preferredDate}</td></tr>
        </table>
        <p style="margin-top:24px;font-size:15px;line-height:1.6">If you have any urgent questions in the meantime, feel free to reach out directly:</p>
        <p style="font-size:15px"><strong>Phone:</strong> ${companyPhone}</p>
        <p style="font-size:15px"><strong>Email:</strong> <a href="mailto:${companyEmailAddr}" style="color:#1B2A4A">${companyEmailAddr}</a></p>
        <p style="margin-top:24px;font-size:15px">— The ${companyName} Team</p>
        `
      ),
    });

    return apiResponse(res, 200, true, null, "Your request has been submitted. We'll be in touch within 24 hours.");
  } catch (err) {
    next(err);
  }
}
