import { auth } from "@/lib/auth";
import { apiRateLimit, authRateLimit, checkoutRateLimit, checkRateLimit } from "@/lib/redis/rate-limit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/2fa",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/products",
  "/categories",
  "/search",
  "/api/auth",
  "/api/health",
  "/api/products",
  "/api/categories",
  "/api/search",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function getIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.ip ?? "unknown";
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
}

function applyLocaleCookie(req: NextRequest, res: NextResponse) {
  if (req.cookies.get("locale")) return;
  const header = req.headers.get("accept-language") ?? "";
  const preferred = header.split(",")[0]?.trim().slice(0, 2) ?? "fr";
  const locale = ["fr", "ar", "en"].includes(preferred) ? preferred : "fr";
  res.cookies.set("locale", locale, { path: "/" });
}

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;
  const session = (req as { auth?: { user?: { role?: string } } }).auth;

  if (pathname.startsWith("/api/")) {
    const id = getIdentifier(req);
    const limiter = pathname.startsWith("/api/auth")
      ? authRateLimit
      : pathname.startsWith("/api/checkout")
        ? checkoutRateLimit
        : apiRateLimit;

    const result = await checkRateLimit(limiter, id);
    if (!result.success) {
      const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
      applySecurityHeaders(res);
      return res;
    }
    const res = NextResponse.next();
    applySecurityHeaders(res);
    return res;
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    const res = NextResponse.next();
    applyLocaleCookie(req, res);
    applySecurityHeaders(res);
    return res;
  }

  // Require auth for protected paths
  if (!session?.user) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(loginUrl);
    applyLocaleCookie(req, res);
    applySecurityHeaders(res);
    return res;
  }

  const role = session.user.role;

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    const res = NextResponse.redirect(new URL("/", req.url));
    applyLocaleCookie(req, res);
    applySecurityHeaders(res);
    return res;
  }

  // Member routes (member or admin)
  if (pathname.startsWith("/member") && role !== "member" && role !== "admin") {
    const res = NextResponse.redirect(new URL("/", req.url));
    applyLocaleCookie(req, res);
    applySecurityHeaders(res);
    return res;
  }

  const res = NextResponse.next();
  applyLocaleCookie(req, res);
  applySecurityHeaders(res);
  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

