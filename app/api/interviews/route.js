import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.action';

// GET /api/interviews - Get all interviews for the current user
export async function GET(request) {
  try {
    // Get current user from Firebase auth
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const interviews = await db.collection('interviews')
      .find({ userId: user.uid })
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB _id to string id for JSON response
    const formattedInterviews = interviews.map(interview => ({
      ...interview,
      id: interview._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(formattedInterviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST /api/interviews - Create a new interview
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
    }

    const newInterview = {
      userId: user.uid,
      title: data.title,
      type: data.type,
      techStack: data.techStack || [],
      status: data.status || 'scheduled',
      score: data.score || null,
      feedback: data.feedback || '',
      questions: data.questions || [],
      duration: data.duration || 30,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : new Date(),
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = await getDatabase();
    const result = await db.collection('interviews').insertOne(newInterview);

    return NextResponse.json({
      ...newInterview,
      id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}
