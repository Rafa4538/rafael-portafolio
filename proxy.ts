import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const preferred = request.cookies.get("preferred-locale")?.value;
    return NextResponse.redirect(new URL(preferred === "en" ? "/en" : "/es", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
