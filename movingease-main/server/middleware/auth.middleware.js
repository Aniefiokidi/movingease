import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, data: null, message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, data: null, message: "Unauthorized" });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, data: null, message: "Invalid token" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ success: false, data: null, message: "Admin only" });
  return next();
}
