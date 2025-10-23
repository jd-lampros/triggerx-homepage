import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.sanity.io"], // Add 'cdn.sanity.io' to the domains array
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
