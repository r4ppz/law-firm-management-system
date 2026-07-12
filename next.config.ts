import type { NextConfig } from "next";

import pkg from "./package.json";

const version = process.env.NEXT_PUBLIC_APP_VERSION ?? pkg.version;

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  generateBuildId: async () => {
    return version;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
