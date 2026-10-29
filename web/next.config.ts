import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // One root layout per locale means no shared not-found boundary; this
    // enables app/global-not-found.tsx for unknown URLs.
    globalNotFound: true,
  },
};

export default nextConfig;
