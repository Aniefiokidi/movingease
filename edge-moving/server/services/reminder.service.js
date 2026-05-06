import cron from "node-cron";
import dayjs from "dayjs";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { sendEmail, emailTemplate } from "./notification.service.js";

export function startReminderCron() {
  cron.schedule("0 9 * * *", async () => {
    const start = dayjs().add(24, "hour").startOf("hour").toDate();
    const end = dayjs().add(24, "hour").endOf("hour").toDate();
    const bookings = await Booking.find({ moveDate: { $gte: start, $lte: end }, status: { $in: ["confirmed", "assigned"] } });
    for (const b of bookings) {
      const user = await User.findById(b.customer);
      if (!user) continue;
      await sendEmail({ to: user.email, subject: "Move Reminder - 24 Hours", html: emailTemplate("Move Reminder", `Your move ${b.bookingRef} is scheduled within 24 hours.`) });
    }
  });
}
