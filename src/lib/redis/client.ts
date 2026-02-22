import { Redis } from "@upstash/redis";

// ─── Singleton Redis client ───────────────────────────────────────────────────
// Lazy validation: env vars are checked at runtime (not build time)
// so Next.js static analysis & edge bundling don't throw during build.

function createRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "[Redis] Missing env vars: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required."
    );
  }

  return new Redis({ url, token });
}

// Reuse the same instance across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _redisClient: Redis | undefined;
}

const redis: Redis =
  globalThis._redisClient ?? (globalThis._redisClient = createRedisClient());

export default redis;
