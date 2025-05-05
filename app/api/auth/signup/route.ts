import { NextResponse } from 'next/server';
import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const { idToken, name, email, uid } = await request.json();
    
    if (!idToken || !uid) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // milliseconds
    });
    
    // Set cookie in the browser
    cookies().set('session', sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    
    // Create user profile in Firestore
    await db.collection('userProfiles').doc(uid).set({
      name: name || 'User',
      email: email || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobTitle: '',
      skills: [],
      experience: 0,
      targetRole: '',
      preferredInterviewTypes: [],
      completedInterviews: 0,
      averageScore: 0,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create account' },
      { status: 500 }
    );
  }
}
