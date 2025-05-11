
// client side  authentications  only when the page navigates or refresh or changing the URL

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(request,"request")
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value ;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if(!accessToken || !refreshToken){
    return NextResponse.json({message:"UnAuthorized user"},{status:401})
  }
  const isPublicPath = pathname === "/";

  if (isPublicPath && accessToken ) {
    // Already logged in, no need to be on login page
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !accessToken) {
    // Trying to access protected route without token
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Everything else is allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};




