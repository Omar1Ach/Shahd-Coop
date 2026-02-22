// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts — Next.js edge middleware (must be at project root)
// Auth guard + role-based route protection
// ─────────────────────────────────────────────────────────────────────────────

export { default } from "@/middleware/index";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
