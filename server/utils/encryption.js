import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const keySeed = process.env.GOV_ID_ENCRYPTION_KEY || process.env.JWT_SECRET || "edge-moving-fallback-key";
const KEY = crypto.createHash("sha256").update(keySeed).digest();

export function encryptText(value = "") {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptText(value = "") {
  if (!value || !value.includes(":")) return value;
  const [ivHex, payload] = value.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(payload, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function maskId(value = "") {
  if (!value) return "";
  if (value.length < 5) return "****";
  return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
}
