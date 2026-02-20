import { auth } from "./index";
import { redirect } from "next/navigation";

/**
 * Get current session in Server Components / Route Handlers.
 * Returns null if unauthenticated.
 */
export async function getSession() {
  return await auth();
}

/**
 * Get current user or redirect to login.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

/**
 * Require a specific role or redirect.
 */
export async function requireRole(role: "admin" | "member" | "customer") {
  const user = await requireAuth();
  if (user.role !== role) redirect("/");
  return user;
}

/**
 * Require admin role or redirect.
 */
export async function requireAdmin() {
  return requireRole("admin");
}

/**
 * Require member role or redirect.
 */
export async function requireMember() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role;
  if (role !== "member" && role !== "admin") redirect("/");
  return session.user;
}
