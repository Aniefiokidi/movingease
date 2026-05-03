import dayjs from "dayjs";

export function generateBookingRef() {
  const stamp = dayjs().format("YYYYMMDD");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EDGE-${stamp}-${rand}`;
}

export function toPublicUser(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.passwordHash;
  return u;
}
