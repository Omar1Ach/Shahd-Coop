import crypto from "crypto";

/**
 * Hash a token (password reset, email verification) using SHA-256
 * before storing in the database. This prevents token theft if the DB
 * is compromised — the raw token is only ever sent via email.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
