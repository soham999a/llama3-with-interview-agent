import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.action';

// GET /api/interviews/[id] - Get a specific interview
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid interview ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const interview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Check if the interview belongs to the current user
    if (interview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      ...interview,
      id: interview._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}

// PUT /api/interviews/[id] - Update an interview
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid interview ID' }, { status: 400 });
    }

    const data = await request.json();
    
    const db = await getDatabase();
    
    // First check if the interview exists and belongs to the user
    const existingInterview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!existingInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (existingInterview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Convert date strings to Date objects
    if (data.scheduledFor) {
      updateData.scheduledFor = new Date(data.scheduledFor);
    }
    
    if (data.completedAt) {
      updateData.completedAt = new Date(data.completedAt);
    }

    // Don't allow changing the userId
    delete updateData.userId;
    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;

    const result = await db.collection('interviews').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No changes made to the interview' }, { status: 400 });
    }

    // If interview is marked as completed, update user stats
    if (data.status === 'completed' && existingInterview.status !== 'completed') {
      // Update user profile stats
      await db.collection('userProfiles').updateOne(
        { userId: user.uid },
        { 
          $inc: { completedInterviews: 1 },
          $set: { updatedAt: new Date() }
        }
      );
    }

    // Get the updated interview
    const updatedInterview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({
      ...updatedInterview,
      id: updatedInterview._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

// DELETE /api/interviews/[id] - Delete an interview
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid interview ID' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // First check if the interview exists and belongs to the user
    const existingInterview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!existingInterview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (existingInterview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the interview
    const result = await db.collection('interviews').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete interview' }, { status: 400 });
    }

    // Also delete any associated feedback
    await db.collection('feedback').deleteMany({
      interviewId: new ObjectId(id)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}
