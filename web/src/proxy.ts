import { NextResponse, type NextRequest } from "next/server";

/**
 * English is served at "/" (app/(en)), so "/en" would only be a duplicate of
 * it. Permanently redirect "/en" and "/en/..." to the unprefixed URL. The
 * matcher keeps this proxy off every other request; both home pages stay
 * statically generated.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = url.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/en", "/en/:path*"],
};
