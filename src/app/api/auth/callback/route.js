import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get our frontend redirect URL from the cookie we set earlier
    const cookies = request.cookies;
    const frontendRedirect = cookies.get('frontend_redirect')?.value || '/';
    
    // Create a simple HTML page that will read the user cookie set by the backend
    // and store it in localStorage for our frontend auth system
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Callback</title>
        </head>
        <body>
          <script>
            // Function to handle the authentication callback
            function handleCallback() {
              try {
                // Function to parse cookies
                function getCookie(name) {
                  const value = \`; \${document.cookie}\`;
                  const parts = value.split(\`; \${name}=\`);
                  if (parts.length === 2) return parts.pop().split(';').shift();
                  return null;
                }
                
                // Get user data from the cookie set by the backend
                const userCookie = getCookie('user');
                if (userCookie) {
                  // Parse the user data
                  try {
                    const userData = JSON.parse(decodeURIComponent(userCookie));
                    console.log('Received user data from cookie');
                    
                    // Store the user data in localStorage
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('User data stored in localStorage');
                    
                    // Redirect to the frontend destination
                    window.location.href = "${frontendRedirect}";
                  } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    window.location.href = '/login?error=AuthFailed';
                  }
                } else {
                  console.error('No user cookie found');
                  window.location.href = '/login?error=AuthFailed';
                }
              } catch (error) {
                console.error('Error during callback handling:', error);
                window.location.href = '/login?error=ServerError';
              }
            }
            
            // Execute the callback handler
            handleCallback();
          </script>
          <p>Completing authentication, please wait...</p>
        </body>
      </html>
    `;
    
    // Return the HTML page as response
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in callback route:', error);
    return NextResponse.redirect('/login?error=ServerError');
  }
} 