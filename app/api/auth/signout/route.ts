import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear session cookie
    cookies().delete('session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
