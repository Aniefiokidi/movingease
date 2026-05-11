import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { signAndSetToken } from "../utils/auth.js";
import { encryptText } from "../utils/encryption.js";
import { apiResponse } from "../utils/response.js";
import { sendEmail, emailTemplate } from "../services/notification.service.js";
import { toPublicUser } from "../utils/helpers.js";

export async function register(req, res, next) {
  try {
    const { password, governmentIdNumber, ...rest } = req.body;
    const existing = await User.findOne({ email: rest.email });
    if (existing) return apiResponse(res, 409, false, null, "Email already exists");

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const user = await User.create({
      ...rest,
      passwordHash: await bcrypt.hash(password, 12),
      governmentIdNumber: encryptText(governmentIdNumber),
      verificationToken
    });

    signAndSetToken(res, user._id);
    await sendEmail({
      to: user.email,
      subject: "Welcome to Edge Moving Solution Ltd.",
      html: emailTemplate("Welcome", `Please verify your email: ${process.env.CLIENT_URL}/verify/${verificationToken}`)
    });

    return apiResponse(res, 201, true, toPublicUser(user), "Registered successfully");
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return apiResponse(res, 401, false, null, "Invalid credentials");

    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) return apiResponse(res, 401, false, null, "Invalid credentials");

    user.lastLogin = new Date();
    await user.save();
    signAndSetToken(res, user._id);
    return apiResponse(res, 200, true, toPublicUser(user), "Logged in");
  } catch (e) { next(e); }
}

export async function logout(_req, res) {
  res.clearCookie("token");
  return apiResponse(res, 200, true, null, "Logged out");
}

export async function verifyEmail(req, res, next) {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return apiResponse(res, 400, false, null, "Invalid token");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return apiResponse(res, 200, true, null, "Email verified");
  } catch (e) { next(e); }
}

export async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return apiResponse(res, 200, true, null, "If account exists, email sent");
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();
    await sendEmail({ to: user.email, subject: "Reset Password", html: emailTemplate("Reset", `${process.env.CLIENT_URL}/reset/${token}`) });
    return apiResponse(res, 200, true, null, "Reset instructions sent");
  } catch (e) { next(e); }
}

export async function resetPassword(req, res, next) {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return apiResponse(res, 400, false, null, "Invalid or expired token");
    user.passwordHash = await bcrypt.hash(req.body.password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return apiResponse(res, 200, true, null, "Password reset successful");
  } catch (e) { next(e); }
}

export async function me(req, res) {
  return apiResponse(res, 200, true, toPublicUser(req.user), "User profile");
}
