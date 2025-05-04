import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/actions/auth.action';

// GET /api/user/profile - Get the current user's profile
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    let profile = await db.collection('userProfiles').findOne({ userId: user.uid });

    // If profile doesn't exist, create a new one
    if (!profile) {
      const newProfile = {
        userId: user.uid,
        name: user.name || user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        jobTitle: '',
        skills: [],
        experience: 0,
        targetRole: '',
        preferredInterviewTypes: [],
        completedInterviews: 0,
        averageScore: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('userProfiles').insertOne(newProfile);
      profile = { ...newProfile, _id: result.insertedId };
    }

    return NextResponse.json({
      ...profile,
      id: profile._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PUT /api/user/profile - Update the current user's profile
export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const db = await getDatabase();
    
    // Check if profile exists
    const existingProfile = await db.collection('userProfiles').findOne({ userId: user.uid });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Don't allow changing certain fields
    delete updateData.userId;
    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.completedInterviews; // These should be updated by the system
    delete updateData.averageScore;        // These should be updated by the system

    const result = await db.collection('userProfiles').updateOne(
      { userId: user.uid },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No changes made to the profile' }, { status: 400 });
    }

    // Get the updated profile
    const updatedProfile = await db.collection('userProfiles').findOne({ userId: user.uid });

    return NextResponse.json({
      ...updatedProfile,
      id: updatedProfile._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
