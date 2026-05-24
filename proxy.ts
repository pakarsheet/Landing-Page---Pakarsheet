import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/admin-login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Hanya proteksi /admin dan semua sub-path-nya
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return new NextResponse("Admin not configured.", { status: 503 });
  }

  if (session === secret) {
    return NextResponse.next();
  }

  // Belum login — redirect ke halaman login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
