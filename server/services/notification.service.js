import { Resend } from "resend";

const LOGO_URL = "https://res.cloudinary.com/dgqxt06km/image/upload/c_crop,g_north_west,h_137,w_351,x_135,y_106/WhatsApp_Image_2026-05-11_at_5.23.53_AM-removebg-preview_ibu9at.png";
const BRAND = "#1B2A4A";
const RED = "#C0272D";

let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: `Edge Moving Solutions <onboarding@resend.dev>`,
    to,
    subject,
    html
  });
}

function baseLayout(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Edge Moving Solutions Ltd.</title></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND};padding:28px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="Edge Moving Solutions Ltd." height="60" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px;">${content}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F4F6F9;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Edge Moving Solutions Ltd. &nbsp;|&nbsp; 506-471-9393 &nbsp;|&nbsp; edgemovingsolution@gmail.com</p>
            <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">Monday – Saturday &nbsp;|&nbsp; 8:00 AM – 6:00 PM</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function customerConfirmationEmail({ firstName, bookingRef, pickupAddress, dropoffAddress, moveDate, preferredTime, items }) {
  const itemRows = items.map((item) =>
    `<tr>
      <td style="padding:8px 12px;font-size:14px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${item.label}${item.isFragile ? ' <span style="background:#fef3c7;color:#92400e;font-size:11px;padding:2px 7px;border-radius:20px;font-weight:600;">Fragile</span>' : ""}</td>
      <td style="padding:8px 12px;font-size:14px;color:#64748b;text-align:center;border-bottom:1px solid #f1f5f9;">×${item.quantity}</td>
      <td style="padding:8px 12px;font-size:14px;color:#64748b;border-bottom:1px solid #f1f5f9;">${item.description || "—"}</td>
    </tr>`
  ).join("");

  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;color:${BRAND};">We've received your request!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Hi ${firstName}, your moving request has been submitted. Our team will review it and contact you within 24 hours to confirm.</p>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;">Reference Number</p>
      <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:${BRAND};font-family:monospace;">${bookingRef}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="50%" style="padding-right:8px;">
          <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;">Pickup</p>
            <p style="margin:6px 0 0;font-size:14px;color:${BRAND};font-weight:600;">${pickupAddress}</p>
          </div>
        </td>
        <td width="50%" style="padding-left:8px;">
          <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;">Dropoff</p>
            <p style="margin:6px 0 0;font-size:14px;color:${BRAND};font-weight:600;">${dropoffAddress}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td width="50%" style="padding-right:8px;padding-top:12px;">
          <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;">Date</p>
            <p style="margin:6px 0 0;font-size:14px;color:${BRAND};font-weight:600;">${moveDate}</p>
          </div>
        </td>
        <td width="50%" style="padding-left:8px;padding-top:12px;">
          <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;">Preferred Time</p>
            <p style="margin:6px 0 0;font-size:14px;color:${BRAND};font-weight:600;">${preferredTime}</p>
          </div>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;">Items to Move</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:left;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Item</th>
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:center;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Qty</th>
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:left;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Notes</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#1e40af;">Our team will reach out to you within <strong>24 hours</strong> to confirm your move and discuss next steps.</p>
    </div>

    <p style="margin:0;font-size:14px;color:#64748b;">Questions? Call us at <a href="tel:+15064719393" style="color:${RED};font-weight:600;text-decoration:none;">506-471-9393</a> or reply to this email.</p>`;

  return baseLayout(content);
}

export function ownerNotificationEmail({ bookingRef, customer, pickupAddress, dropoffAddress, moveDate, preferredTime, items }) {
  const itemRows = items.map((item) =>
    `<tr>
      <td style="padding:10px 12px;font-size:14px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${item.label}${item.isFragile ? ' <span style="background:#fef3c7;color:#92400e;font-size:11px;padding:2px 7px;border-radius:20px;font-weight:600;">FRAGILE</span>' : ""}</td>
      <td style="padding:10px 12px;font-size:14px;color:#64748b;text-align:center;border-bottom:1px solid #f1f5f9;">×${item.quantity}</td>
      <td style="padding:10px 12px;font-size:14px;color:#64748b;border-bottom:1px solid #f1f5f9;">${item.description || "—"}</td>
    </tr>`
  ).join("");

  const hasFragile = items.some((i) => i.isFragile);

  const content = `
    <div style="background:${RED};border-radius:8px;padding:14px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:.08em;">New Booking Request</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#fff;font-family:monospace;">${bookingRef}</p>
    </div>

    <p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;">Customer Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${[
        ["Name", `${customer.firstName} ${customer.lastName}`],
        ["Email", `<a href="mailto:${customer.email}" style="color:${RED};text-decoration:none;">${customer.email}</a>`],
        ["Phone", `<a href="tel:${customer.phone}" style="color:${RED};text-decoration:none;">${customer.phone}</a>`]
      ].map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;width:120px;">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#1e293b;">${value}</td>
        </tr>`).join("")}
    </table>

    <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;">Move Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${[
        ["From", pickupAddress],
        ["To", dropoffAddress],
        ["Date", moveDate],
        ["Time", preferredTime]
      ].map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? "background:#f8fafc;" : ""}">
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;width:120px;">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#1e293b;">${value}</td>
        </tr>`).join("")}
    </table>

    <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;">Items to Move${hasFragile ? ' &nbsp;<span style="background:#fef3c7;color:#92400e;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:700;">Contains Fragile Items</span>' : ""}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:8px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:left;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Item</th>
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:center;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Qty</th>
          <th style="padding:10px 12px;font-size:12px;font-weight:700;text-align:left;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Notes</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>`;

  return baseLayout(content);
}
