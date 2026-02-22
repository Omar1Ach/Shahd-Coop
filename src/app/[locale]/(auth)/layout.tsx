import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | ShahdCoop",
    default: "Auth | ShahdCoop",
  },
};

/**
 * Auth group layout — no SiteHeader/SiteFooter.
 * Clean centered layout for all auth pages.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
