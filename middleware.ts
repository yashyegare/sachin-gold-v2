import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Locale negotiation + prefixing for every page route. Static assets,
// Next internals and the favicon are excluded below.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|videos|.*\\..*).*)"],
};
