import { auth } from "@/lib/auth";
import { apiRateLimit, authRateLimit, checkoutRateLimit, checkRateLimit } from "@/lib/redis/rate-limit";
import { routing } from "@/i18n/routing";
import createIntlMiddleware from "next-intl/middleware";
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

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return { locale, pathname: "/" };
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, pathname: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: routing.defaultLocale, pathname };
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

const intlMiddleware = createIntlMiddleware(routing);

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

  const intlResponse = intlMiddleware(req);
  const isRedirect =
    intlResponse.headers.get("location") ||
    intlResponse.headers.get("x-middleware-rewrite");
  if (isRedirect) {
    applySecurityHeaders(intlResponse);
    return intlResponse;
  }

  const { locale, pathname: normalizedPath } = stripLocale(pathname);

  if (isPublicPath(normalizedPath)) {
    const res = NextResponse.next();
    applySecurityHeaders(res);
    return res;
  }

  // Require auth for protected paths
  if (!session?.user) {
    const loginUrl = new URL(`/${locale}/auth/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(loginUrl);
    applySecurityHeaders(res);
    return res;
  }

  const role = session.user.role;

  // Admin-only routes
  if (normalizedPath.startsWith("/admin") && role !== "admin") {
    const res = NextResponse.redirect(new URL(`/${locale}`, req.url));
    applySecurityHeaders(res);
    return res;
  }

  // Member routes (member or admin)
  if (normalizedPath.startsWith("/member") && role !== "member" && role !== "admin") {
    const res = NextResponse.redirect(new URL(`/${locale}`, req.url));
    applySecurityHeaders(res);
    return res;
  }

  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

