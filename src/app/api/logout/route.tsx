// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/actions/auth';

export async function POST(request: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    console.log('Logging out...');
    // Clear auth cookies
    clearAuthCookies(response);

    // Add header to clear local storage (will be handled by client)
    response.headers.set('Clear-Site-Data', '"cookies", "storage"');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}