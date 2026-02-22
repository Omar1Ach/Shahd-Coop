import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "../styles/tokens.css";
import "./globals.css";

// ─── Fonts — matching ShahdCoop design system ────────────────────────────────

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "ShahdCoop — Premium Natural Honey",
    template: "%s | ShahdCoop",
  },
  description:
    "Premium natural honey & bee products from cooperative farms across North Africa.",
  keywords: ["honey", "natural", "organic", "bee products", "cooperative", "Algeria"],
  openGraph: {
    title: "ShahdCoop — Premium Natural Honey",
    description: "Premium natural honey & bee products from cooperative farms.",
    type: "website",
    locale: "en_US",
    siteName: "ShahdCoop",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFBF2" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1208" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSans.variable} ${jetbrainsMono.variable} ${notoArabic.variable}`}
    >
      <body className="antialiased flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] font-[var(--font-body)]">
        <SessionProvider>
          <ThemeProvider>
            <SiteHeader />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <SiteFooter />
            <MobileNav />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
