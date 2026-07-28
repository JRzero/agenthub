import path from "node:path";
import type { NextConfig } from "next";
import { resolveNextDistDir } from "./src/config/next-build-output";

const nextConfig: NextConfig = {
  distDir: resolveNextDistDir(process.env.NODE_ENV),
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "@phosphor-icons/react": "@phosphor-icons/react/ssr",
    },
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.resolve.alias["@phosphor-icons/react"] = path.resolve(
        process.cwd(),
        "node_modules/@phosphor-icons/react/dist/ssr/index.es.js",
      );
    }
    return config;
  },
};

export default nextConfig;
