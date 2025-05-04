import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/actions/auth.action';

// GET /api/interviews/[id]/feedback - Get feedback for a specific interview
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
    
    // First check if the interview exists and belongs to the user
    const interview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (interview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the feedback for this interview
    const feedback = await db.collection('feedback').findOne({
      interviewId: new ObjectId(id)
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...feedback,
      id: feedback._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

// POST /api/interviews/[id]/feedback - Create feedback for an interview
export async function POST(request, { params }) {
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
    
    // Validate required fields
    if (!data.overallScore || !data.summary) {
      return NextResponse.json({ error: 'Overall score and summary are required' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // First check if the interview exists and belongs to the user
    const interview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (interview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if feedback already exists
    const existingFeedback = await db.collection('feedback').findOne({
      interviewId: new ObjectId(id)
    });

    if (existingFeedback) {
      return NextResponse.json({ error: 'Feedback already exists for this interview' }, { status: 400 });
    }

    const newFeedback = {
      interviewId: new ObjectId(id),
      userId: user.uid,
      overallScore: data.overallScore,
      technicalScore: data.technicalScore || null,
      communicationScore: data.communicationScore || null,
      problemSolvingScore: data.problemSolvingScore || null,
      summary: data.summary,
      strengths: data.strengths || [],
      areasForImprovement: data.areasForImprovement || [],
      detailedFeedback: data.detailedFeedback || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('feedback').insertOne(newFeedback);

    // Update the interview with the score
    await db.collection('interviews').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          score: data.overallScore,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    // Update user profile stats
    await db.collection('userProfiles').updateOne(
      { userId: user.uid },
      { 
        $inc: { completedInterviews: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({
      ...newFeedback,
      id: result.insertedId.toString(),
      interviewId: id
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}

// PUT /api/interviews/[id]/feedback - Update feedback for an interview
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
    const interview = await db.collection('interviews').findOne({
      _id: new ObjectId(id)
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (interview.userId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if feedback exists
    const existingFeedback = await db.collection('feedback').findOne({
      interviewId: new ObjectId(id)
    });

    if (!existingFeedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Don't allow changing certain fields
    delete updateData.userId;
    delete updateData.interviewId;
    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;

    const result = await db.collection('feedback').updateOne(
      { interviewId: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No changes made to the feedback' }, { status: 400 });
    }

    // Update the interview score if overall score changed
    if (data.overallScore) {
      await db.collection('interviews').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            score: data.overallScore,
            updatedAt: new Date()
          } 
        }
      );
    }

    // Get the updated feedback
    const updatedFeedback = await db.collection('feedback').findOne({
      interviewId: new ObjectId(id)
    });

    return NextResponse.json({
      ...updatedFeedback,
      id: updatedFeedback._id.toString(),
      _id: undefined,
      interviewId: id
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}
