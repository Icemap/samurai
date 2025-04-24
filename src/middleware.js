import { NextResponse } from 'next/server';

// List of public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/icon.jpg'];

// List of API routes that need protection
const PROTECTED_API_ROUTES = ['/api/linkedin', '/api/search', '/api/pitch-generator'];

// All API routes pattern for detecting any API request
const API_PATH_PATTERN = /^\/api\//;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Function to check if the route should be protected
  const isProtectedPage = !PUBLIC_PATHS.some(path => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );
  
  // Check if this is an API route that needs protection
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if this is any API route (for handling 401 vs redirect)
  const isApiRoute = API_PATH_PATTERN.test(pathname);
  
  // Get authentication status from cookies
  const cookies = request.cookies;
  const isAuthenticated = cookies.has('user_id');
  
  // Redirect to login if accessing protected route without authentication
  if ((isProtectedPage || isProtectedApiRoute) && !isAuthenticated) {
    // For ANY API routes, return 401 Unauthorized instead of redirecting
    if (isApiRoute) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For page routes, redirect to login
    const url = new URL('/login', request.url);
    // Add the current path as a callback URL after login
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Match all routes except for static files, images, and other assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 