import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShahdCoop — Premium Natural Honey",
    template: "%s | ShahdCoop",
  },
  description: "Premium natural honey & bee products from cooperative farms.",
  keywords: ["honey", "natural", "organic", "bee products", "cooperative"],
  openGraph: {
    title: "ShahdCoop",
    description: "Premium natural honey & bee products from cooperative farms.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
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

