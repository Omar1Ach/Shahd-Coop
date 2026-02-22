import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  async redirects() {
    return [
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/register", destination: "/auth/register", permanent: true },
      { source: "/forgot-password", destination: "/auth/forgot-password", permanent: true },
      { source: "/reset-password", destination: "/auth/reset-password", permanent: true },
      { source: "/verify-email", destination: "/auth/verify-email", permanent: true },
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

export default nextConfig;
