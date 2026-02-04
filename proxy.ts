import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
   const path = request.nextUrl.pathname;
   const isPublicPath =  path === '/login' || path === '/register' || path.startsWith('/pending-verification');
   const token = request.cookies.get("token")?.value;
   if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

   if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    return NextResponse.next();
}
export const config = {
  matcher: [
    '/profile/:path*',
    '/profile',    
    '/login',
    '/register',
    '/pending-verification',
    '/pending-verification/:path*',
    '/'
],
}