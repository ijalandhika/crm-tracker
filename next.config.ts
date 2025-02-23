import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "txprint.id",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "hbkyzczkmmxgauyltduw.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
