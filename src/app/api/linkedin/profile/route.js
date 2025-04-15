import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    // Extract linkedin_profile_url from query params
    const { searchParams } = new URL(request.url);
    const linkedinProfileUrl = searchParams.get('linkedin_profile_url');
    
    if (!linkedinProfileUrl) {
      return NextResponse.json({ error: 'Missing linkedin_profile_url parameter' }, { status: 400 });
    }
    
    // Get API key from environment variables
    const apiKey = process.env.PROXYCURL_API_KEY || process.env.NEXT_PUBLIC_PROXYCURL_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    // Make the request to Proxycurl API
    const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
      params: {
        linkedin_profile_url: linkedinProfileUrl,
      },
      headers: {
        'Authorization': 'Bearer ' + apiKey
      }
    });
    
    // Return the data from Proxycurl
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { error: error.message || 'Failed to fetch LinkedIn profile' },
      { status: error.response?.status || 500 }
    );
  }
} 