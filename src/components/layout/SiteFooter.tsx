import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-1)] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
              {t("appName")}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Premium natural honey &amp; bee products, sourced from cooperative farms.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">{t("shop")}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/products", label: t("allProducts") },
                { href: "/categories", label: t("categories") },
                { href: "/search", label: t("search") },
                { href: "/cart", label: t("cart") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">{t("company")}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/about", label: t("about") },
                { href: "/blog", label: t("blog") },
                { href: "/contact", label: t("contact") },
                { href: "/faq", label: t("faq") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">{t("accountSection")}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/auth/login", label: t("signIn") },
                { href: "/auth/register", label: t("register") },
                { href: "/account/orders", label: t("myOrders") },
                { href: "/account/wishlist", label: t("wishlist") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} ShahdCoop. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--color-primary)]">{t("privacyPolicy")}</Link>
            <Link href="/terms" className="hover:text-[var(--color-primary)]">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
