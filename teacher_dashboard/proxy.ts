
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/guide",
  "/about",
  "/book",
  "/video",
  "/guideline",
  "/exam",
  "/test",
  "/profile",
];


const AUTH_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;


  const accessToken = req.cookies.get("access_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuth = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && accessToken) {
    return NextResponse.redirect(new URL("/guide", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/guide",
    "/login",
    "/register",
    "/about",
    "/book",
      "/video",
  "/guideline",
  "/exam",
  "/test",
  "/profile",
  ],
};
