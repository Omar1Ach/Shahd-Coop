import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Source_Sans_3,
  JetBrains_Mono,
  Noto_Sans_Arabic,
} from "next/font/google";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { siteConfig } from "@/config/site";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

// ─── Font Loading ─────────────────────────────────────────────────────────────
// next/font automatically self-hosts and optimises fonts.
// Each font is loaded once, tree-shaken, and inlined as CSS vars.

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1714" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Natural Honey`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["honey", "natural", "organic", "bee products", "cooperative", "Morocco"],
  authors: [{ name: "ShahdCoop" }],
  creator: "ShahdCoop",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Premium Natural Honey`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium Natural Honey`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVars = [
    playfair.variable,
    sourceSans.variable,
    jetbrainsMono.variable,
    notoArabic.variable,
  ].join(" ");

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={fontVars}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
