import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  await getTransporter().sendMail({ from: `${process.env.COMPANY_NAME} <${process.env.SMTP_USER}>`, to, subject, html });
}

export function emailTemplate(title, body) {
  return `<div style="font-family:DM Sans,Arial,sans-serif;background:#F4F6F9;padding:24px"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px"><h2 style="color:#1B2A4A">${title}</h2><div style="color:#1B2A4A">${body}</div></div></div>`;
}
