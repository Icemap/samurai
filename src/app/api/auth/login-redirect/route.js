import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the callback URL from query parameters
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    // Create response with redirect to backend login endpoint
    const response = NextResponse.redirect(process.env.BACKEND_URL + '/login');
    
    // Set the frontend_redirect cookie for after authentication
    response.cookies.set('frontend_redirect', callbackUrl, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 10, // 10 minutes expiry
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Error during login redirect:', error);
    return NextResponse.redirect('/login?error=ServerError');
  }
} 