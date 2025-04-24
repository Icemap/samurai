import { NextResponse } from 'next/server';

// Define the keys for user data expected from the backend
const USER_COOKIE_KEYS = [
  'user_id', 
  'user_email', 
  'user_name', 
  'user_picture', 
  'user_given_name', 
  'user_family_name', 
  'user_hd', 
  'user_verified_email'
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Retrieve the original redirect URL from the 'frontend_redirect' cookie
    const cookies = request.cookies;
    const redirectUrl = cookies.get('frontend_redirect')?.value || '/'; // Default to home page

    // Create a response object to redirect and set cookies
    // Ensure the redirect URL is absolute
    const absoluteRedirectUrl = new URL(redirectUrl, request.url).toString();
    const response = NextResponse.redirect(absoluteRedirectUrl);

    // Extract user data from query parameters and set cookies
    USER_COOKIE_KEYS.forEach(key => {
      const value = searchParams.get(key);
      if (value !== null && value !== undefined) {
        // Set cookie with appropriate options (e.g., path, httpOnly, secure in production)
        response.cookies.set(key, value, {
          path: '/',
          // Consider adding httpOnly: true and secure: true for production
          maxAge: 60 * 60 * 24 * 7, // 7 days expiry for example
          sameSite: 'lax'
        });
      }
    });

    // Clear the frontend_redirect cookie as it's no longer needed
    response.cookies.delete('frontend_redirect', { path: '/' });

    return response;

  } catch (error) {
    console.error('Error in login callback route:', error);
    // Redirect to login page with error if something goes wrong
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'CallbackFailed');
    return NextResponse.redirect(errorUrl);
  }
} 