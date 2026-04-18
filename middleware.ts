import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Paths that don't require authentication
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/auth/callback");
  
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  if (isAuthPage) {
    if (session) {
      try {
        await decrypt(session);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (err) {
        // Invalid session, let user stay on login page
      }
    }
    return NextResponse.next();
  }

  // Protect all other pages
  if (!session) {
    if (isApiRoute && !request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isApiRoute && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch (err) {
    // Session expired or invalid
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
