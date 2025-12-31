import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_IDS = [
  "695282db7390e96c6251430b",
  "69548b5f22b36495cbcfe1e0",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const id = pathname.split("/")[2]; 

  if (!id || !ALLOWED_IDS.includes(id)) {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/test/:id*"],
};
