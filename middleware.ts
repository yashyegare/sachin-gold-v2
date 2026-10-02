import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Generated metadata routes (the social card, in particular) live under
 * [locale], so their URLs always carry a prefix — /en/opengraph-image.
 * Locale negotiation sees that "en" as a prefix to strip and bounces the
 * request, and the share image then resolves through redirects to a URL
 * that has no route behind it. Twitter, WhatsApp and LinkedIn either don't
 * follow redirects for images or don't follow them far, so the card comes
 * out blank. These paths go straight to the router instead.
 */
const METADATA_ROUTE =
  /\/(?:opengraph-image|twitter-image|facebook-image|instagram-image|icon|apple-icon|manifest|favicon)$/;

export default function middleware(request: NextRequest) {
  if (METADATA_ROUTE.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|videos|.*\\..*).*)"],
};
