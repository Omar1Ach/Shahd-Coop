import { authenticator } from "otplib";
import crypto from "crypto";

const APP_NAME = "ShahdCoop";

// ─── TOTP Secret ──────────────────────────────────────────────────────────────

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function getTotpUri(secret: string, email: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

/**
 * Verify a 6-digit TOTP token against a secret.
 * Returns false on any error to avoid leaking details.
 */
export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

// ─── Backup Codes ─────────────────────────────────────────────────────────────

/**
 * Generate N cryptographically random backup codes.
 * Codes are uppercased 8-char hex strings (e.g. "A3F2B1C4").
 */
export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}

/**
 * Hash a backup code with SHA-256 before storing in DB.
 * Always normalize to uppercase and trim whitespace.
 */
export function hashBackupCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}

/**
 * Constant-time comparison of a raw code against its stored hash.
 */
export function verifyBackupCode(raw: string, storedHash: string): boolean {
  const inputHash = hashBackupCode(raw);
  return crypto.timingSafeEqual(
    Buffer.from(inputHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}
