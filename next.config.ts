import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const locale = routing.defaultLocale;

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  async redirects() {
    return [
      { source: "/login", destination: `/${locale}/auth/login`, permanent: true },
      { source: "/register", destination: `/${locale}/auth/register`, permanent: true },
      { source: "/forgot-password", destination: `/${locale}/auth/forgot-password`, permanent: true },
      { source: "/reset-password", destination: `/${locale}/auth/reset-password`, permanent: true },
      { source: "/verify-email", destination: `/${locale}/auth/verify-email`, permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  logging: {
    fetches: { fullUrl: true },
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
