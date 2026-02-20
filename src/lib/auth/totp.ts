import { authenticator } from "otplib";
import crypto from "crypto";

const APP_NAME = "ShahdCoop";

// ─── TOTP Secret ─────────────────────────────────────────────────────────────

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function getTotpUri(secret: string, email: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

// ─── Backup Codes ─────────────────────────────────────────────────────────────

export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}

export function hashBackupCode(code: string): string {
  return crypto.createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}

export function verifyBackupCode(code: string, hashed: string): boolean {
  return hashBackupCode(code) === hashed;
}
