import { NextResponse, NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
   const path = request.nextUrl.pathname;
   const isPublicPath = path === '/login' || path === '/register' || path.startsWith('/pending-verification') || path === '/' || path.startsWith('/resetpassword') || path.startsWith('/forgotpassword');
   const isAccessibleByLoggedInUser = (path === '/login' || path === '/register' || path.startsWith('/pending-verification') || path.startsWith('/resetpassword') || path.startsWith('/forgotpassword'));
   const token = request.cookies.get("token")?.value;
   
   // Redirect logged-in users away from login/register pages (but allow home page)
   if ( isAccessibleByLoggedInUser && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
   }

   // Protect non-public routes - redirect to login if not authenticated
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
    '/resetpassword',
    '/resetpassword/:path*',
    '/forgotpassword',
    '/',
  ],
}