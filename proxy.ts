import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const TESTER_ALLOWED_PATH = ['/test'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  const id = pathname.split("/")[2];

  if (!token) return NextResponse.redirect(new URL("/rip/auth", request.url));

  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    if (payload.user === id && payload.role === "admin") {
      return NextResponse.next();
    }
    if (payload.user === id && payload.role === "tester") {
      const allowed = TESTER_ALLOWED_PATH.some((path) =>
        pathname.startsWith(path)
      );
      if (!allowed) return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (!id || payload.user !== id) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/test/:id*", "/upload/:id*", "/admin/:id*"],
};
