import { renderOgImage } from "@/lib/og";

// Social card of this locale's home page (og:image and twitter:image).
// A route handler instead of opengraph-image.tsx: inside a route group that
// convention adds a hash to the URL, and JSON-LD needs a stable address.
export const dynamic = "force-static";

export function GET() {
  return renderOgImage("en");
}
