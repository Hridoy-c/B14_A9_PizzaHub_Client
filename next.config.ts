
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  cacheComponents: true,

  partialPrefetching: true,

  reactCompiler: true,

  turbopack: {
    // Keep the project root inside this repo instead of the parent folder
    // that happens to contain a package-lock.json.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
