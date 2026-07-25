import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isLeadsApi = pathname.startsWith("/api/leads");
  const isPublicLeadSubmission = isLeadsApi && method === "POST";
  const isProtectedApi = isLeadsApi && !isPublicLeadSubmission;

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/leads/:path*"],
};
