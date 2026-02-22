import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  async redirects() {
    return [
      { source: "/login", destination: "/fr/auth/login", permanent: true },
      { source: "/register", destination: "/fr/auth/register", permanent: true },
      { source: "/forgot-password", destination: "/fr/auth/forgot-password", permanent: true },
      { source: "/reset-password", destination: "/fr/auth/reset-password", permanent: true },
      { source: "/verify-email", destination: "/fr/auth/verify-email", permanent: true },
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
