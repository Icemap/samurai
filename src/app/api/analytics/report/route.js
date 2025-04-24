import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const payload = await request.json();
    
    // Forward the request to the external API
    const response = await fetch(process.env.BACKEND_URL + '/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Error reporting user action: ${response.statusText}`);
    }
    
    // Return the response from the external API
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to report user action:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 