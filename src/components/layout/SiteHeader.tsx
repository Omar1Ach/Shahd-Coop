"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--color-surface-0)] border-[var(--color-border)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
          🍯 ShahdCoop
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]" aria-label="Cart">
            🛒
          </Link>
          <Link href="/account/wishlist" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]" aria-label="Wishlist">
            🤍
          </Link>

          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/account/profile">
                <Badge variant="outline" className="cursor-pointer">
                  {session.user?.name?.split(" ")[0] ?? "Account"}
                </Badge>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-0)] px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-[var(--color-border)]" />
          {session ? (
            <>
              <Link href="/account/profile" onClick={() => setMobileOpen(false)} className="text-sm">My Account</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left text-sm text-red-500">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-[var(--color-primary)]">Sign In</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
