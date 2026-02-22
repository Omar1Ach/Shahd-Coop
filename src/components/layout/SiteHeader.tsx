"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/shared/ThemeProvider";

const navLinks = [
  { href: "/products", key: "products" },
  { href: "/categories", key: "categories" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export function SiteHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="ds-header">
      <div className="ds-header-inner">
        <Link href="/" className="ds-logo">
          <span>shahd</span>coop
        </Link>

        <nav className="ds-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(isActive(link.href) && "active")}
            >
              {t(link.key)}
            </Link>
          ))}
          <button
            className="ds-theme-toggle"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"/>
            </svg>
          </button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href="/"
                locale={l}
                className={cn(
                  "text-xs uppercase tracking-widest",
                  l === locale ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                )}
              >
                {l}
              </Link>
            ))}
          </div>

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

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/account/profile">
                <Badge variant="outline" className="cursor-pointer">
                  {session.user?.name?.split(" ")[0] ?? t("account")}
                </Badge>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
              >
                {t("signOut")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">{t("signIn")}</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="rounded-md p-2 transition-colors hover:bg-[var(--color-surface-2)] md:hidden"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

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
              {t(link.key)}
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
                {t("account")}
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: `/${locale}` }); }}
                className="text-left text-sm text-red-500"
              >
                {t("signOut")}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>{t("signIn")}</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button size="sm" fullWidth>{t("register")}</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
