"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

// â”€â”€â”€ Nav links â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function SiteHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold"
          style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
        >
          ShahdCoop
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="transition-colors hover:text-[var(--color-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </Link>
          <Link
            href="/account/wishlist"
            className="transition-colors hover:text-[var(--color-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </Link>

          {/* Desktop auth */}
          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/account/profile">
                <Badge variant="outline" className="cursor-pointer">
                  {session.user?.name?.split(" ")[0] ?? "Account"}
                </Badge>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="rounded-md p-2 transition-colors hover:bg-[var(--color-surface-2)] md:hidden"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
        style={{ borderTop: mobileOpen ? "1px solid var(--color-border)" : "none" }}
      >
        <nav
          className="flex flex-col gap-3 px-4 py-4"
          style={{ background: "var(--color-surface-1)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ borderColor: "var(--color-border)" }} />
          {session ? (
            <>
              <Link
                href="/account/profile"
                onClick={() => setMobileOpen(false)}
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                My Account
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                className="text-left text-sm text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>Sign In</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button size="sm" fullWidth>Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

