import redis from "./client";

const DEFAULT_TTL = 60 * 5; // 5 minutes

// ─── Generic cache helpers ──────────────────────────────────────────────────

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

export async function deleteCacheByPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// ─── Cart cache ─────────────────────────────────────────────────────────────

export const CART_TTL = 60 * 60 * 24 * 7; // 7 days

export function cartKey(userId: string) {
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

// ─── Product cache ───────────────────────────────────────────────────────────

export function productKey(slug: string) {
  return `shahd:product:${slug}`;
}

export function productListKey(page: number, filter: string) {
  return `shahd:products:${page}:${filter}`;
}

export async function invalidateProductCache(slug: string): Promise<void> {
  await deleteCache(productKey(slug));
  await deleteCacheByPattern("shahd:products:*");
}

// ─── Category cache ──────────────────────────────────────────────────────────

export const CATEGORY_KEY = "shahd:categories";

export async function invalidateCategoryCache(): Promise<void> {
  await deleteCache(CATEGORY_KEY);
}

// ─── Session / OTP ───────────────────────────────────────────────────────────

export const OTP_TTL = 60 * 10; // 10 minutes

export function otpKey(userId: string) {
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
