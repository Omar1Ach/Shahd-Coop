export const siteConfig = {
  name: "ShahdCoop",
  description:
    "Premium natural honey & bee products from a cooperative of passionate beekeepers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/shahdcoop",
    facebook: "https://facebook.com/shahdcoop",
  },
  locales: ["fr", "ar", "en"] as const,
  defaultLocale: "fr" as const,
};

export type SiteConfig = typeof siteConfig;
