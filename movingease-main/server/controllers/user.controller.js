import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { apiResponse } from "../utils/response.js";
import { encryptText } from "../utils/encryption.js";

export async function getProfile(req, res) {
  const user = req.user.toObject();
  delete user.passwordHash;
  return apiResponse(res, 200, true, user, "Profile");
}

export async function updateProfile(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.governmentIdNumber) updates.governmentIdNumber = encryptText(updates.governmentIdNumber);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    const data = user.toObject();
    delete data.passwordHash;
    return apiResponse(res, 200, true, data, "Profile updated");
  } catch (e) { next(e); }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return apiResponse(res, 400, false, null, "Current password is incorrect");
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return apiResponse(res, 200, true, null, "Password changed");
  } catch (e) { next(e); }
}

export async function addSavedAddress(req, res, next) {
  try {
    req.user.savedAddresses.push(req.body);
    await req.user.save();
    return apiResponse(res, 201, true, req.user.savedAddresses, "Saved address added");
  } catch (e) { next(e); }
}

export async function deleteSavedAddress(req, res, next) {
  try {
    req.user.savedAddresses = req.user.savedAddresses.filter((a) => String(a._id) !== req.params.id);
    await req.user.save();
    return apiResponse(res, 200, true, req.user.savedAddresses, "Saved address removed");
  } catch (e) { next(e); }
}
