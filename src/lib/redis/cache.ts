import redis from "./client";

// ─── TTL constants ────────────────────────────────────────────────────────────
const DEFAULT_TTL = 60 * 5; // 5 min
export const CART_TTL = 60 * 60 * 24 * 7; // 7 days
export const OTP_TTL = 60 * 10; // 10 min
export const CATEGORY_KEY = "shahd:categories";

// ─── Generic helpers ──────────────────────────────────────────────────────────

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get<T>(key);
  return data ?? null;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL
): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Delete multiple keys matching a pattern using cursor-based SCAN.
 * Unlike keys(), scan() does not block the Redis server.
 */
export async function deleteCacheByPattern(pattern: string): Promise<void> {
  let cursor = "0";
  do {
    const result = await redis.scan(cursor, { match: pattern, count: 100 });
    const nextCursor = String(result[0]);
    const keys = result[1] as string[];
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    cursor = nextCursor;
  } while (cursor !== "0");
}

// ─── Cart cache ───────────────────────────────────────────────────────────────

export function cartKey(userId: string): string {
  return `shahd:cart:${userId}`;
}

export async function getCart<T>(userId: string): Promise<T | null> {
  return getCache<T>(cartKey(userId));
}

export async function setCart<T>(userId: string, cart: T): Promise<void> {
  await setCache(cartKey(userId), cart, CART_TTL);
}

export async function deleteCart(userId: string): Promise<void> {
  await deleteCache(cartKey(userId));
}

// ─── Product cache ────────────────────────────────────────────────────────────

export function productKey(slug: string): string {
  return `shahd:product:${slug}`;
}

export function productListKey(page: number, filter: string): string {
  return `shahd:products:${page}:${filter}`;
}

export async function invalidateProductCache(slug: string): Promise<void> {
  await deleteCache(productKey(slug));
  await deleteCacheByPattern("shahd:products:*");
}

// ─── Category cache ───────────────────────────────────────────────────────────

export async function invalidateCategoryCache(): Promise<void> {
  await deleteCache(CATEGORY_KEY);
}

// ─── OTP / 2FA cache ──────────────────────────────────────────────────────────

export function otpKey(userId: string): string {
  return `shahd:otp:${userId}`;
}

export async function setOtp(userId: string, secret: string): Promise<void> {
  await setCache(otpKey(userId), secret, OTP_TTL);
}

export async function getOtp(userId: string): Promise<string | null> {
  return getCache<string>(otpKey(userId));
}

export async function deleteOtp(userId: string): Promise<void> {
  await deleteCache(otpKey(userId));
}
