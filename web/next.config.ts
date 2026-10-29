import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // One root layout per locale means no shared not-found boundary; this
    // enables app/global-not-found.tsx for unknown URLs.
    globalNotFound: true,
  },
  // English is served at "/" (app/(en)), so "/en" would only duplicate it.
  // Config redirects instead of proxy.ts: no runtime code, and supported by
  // every host's Next.js adapter (Netlify included).
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
