import { auth } from "@/lib/auth";
import { apiRateLimit, authRateLimit, checkoutRateLimit, checkRateLimit } from "@/lib/redis/rate-limit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
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
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    return NextResponse.next();
  }

  // Allow public paths
  if (isPublicPath(pathname)) return NextResponse.next();

  // Require auth for protected paths
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Member routes (member or admin)
  if (pathname.startsWith("/member") && role !== "member" && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
