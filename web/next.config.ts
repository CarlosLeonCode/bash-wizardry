import { existsSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * @carlosleoncode/lead-capture is private (GitHub Packages) and listed in
 * optionalDependencies, so `npm install` without a token skips it. When it is
 * missing, Turbopack resolves its imports to no-op stand-ins instead; when it
 * is installed, no alias is set and the real package is bundled. Types follow
 * the same rule through src/types/lead-capture.d.ts. Restart `next dev` after
 * installing or removing the package. (tsconfig "paths" with two fallbacks
 * would cover both, but Next's SWC config loader rejects multi-target paths
 * without a wildcard.)
 */
const LEAD_CAPTURE = "@carlosleoncode/lead-capture";
const hasLeadCapture = existsSync(
  path.resolve(process.cwd(), "node_modules", LEAD_CAPTURE, "package.json"),
);

if (process.env.NEXT_PUBLIC_LEADS_ENDPOINT?.trim() && !hasLeadCapture) {
  console.warn(
    `⚠ NEXT_PUBLIC_LEADS_ENDPOINT is set but ${LEAD_CAPTURE} is not installed ` +
      "(missing GITHUB_PACKAGES_TOKEN?): building without the subscription.",
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Read by src/lib/leads.ts: the subscription needs the package AND an endpoint.
  env: { LEAD_CAPTURE_INSTALLED: String(hasLeadCapture) },
  experimental: {
    // One root layout per locale means no shared not-found boundary; this
    // enables app/global-not-found.tsx for unknown URLs.
    globalNotFound: true,
  },
  turbopack: {
    resolveAlias: hasLeadCapture
      ? {}
      : {
          [LEAD_CAPTURE]: "./src/lib/lead-capture-fallback.tsx",
          [`${LEAD_CAPTURE}/styles.css`]: "./src/lib/lead-capture-fallback.css",
        },
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
