import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
  cacheComponents: true,
  cacheLife: {
    catalog: {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
    product: {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
  },
};

export default nextConfig;
