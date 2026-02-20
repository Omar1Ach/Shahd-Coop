import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-1)] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
              🍯 ShahdCoop
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Premium natural honey &amp; bee products, sourced from cooperative farms.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">Shop</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/categories", label: "Categories" },
                { href: "/search", label: "Search" },
                { href: "/cart", label: "Cart" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">Company</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">Account</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Register" },
                { href: "/account/orders", label: "My Orders" },
                { href: "/account/wishlist", label: "Wishlist" },
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
            <Link href="/privacy" className="hover:text-[var(--color-primary)]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--color-primary)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
