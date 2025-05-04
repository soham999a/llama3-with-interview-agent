import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/actions/auth.action';

// GET /api/user/stats - Get the current user's interview statistics
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    
    // Get total interviews count
    const totalInterviews = await db.collection('interviews').countDocuments({ userId: user.uid });
    
    // Get count of interviews by status
    const statusCounts = await db.collection('interviews').aggregate([
      { $match: { userId: user.uid } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();
    
    // Get average score for completed interviews
    const scoreResult = await db.collection('interviews').aggregate([
      { $match: { userId: user.uid, status: 'completed', score: { $ne: null } } },
      { $group: { _id: null, averageScore: { $avg: '$score' } } }
    ]).toArray();
    
    // Get count by interview type
    const typeCounts = await db.collection('interviews').aggregate([
      { $match: { userId: user.uid } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]).toArray();
    
    // Get recent interviews
    const recentInterviews = await db.collection('interviews')
      .find({ userId: user.uid })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Format the results
    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    const typeMap = typeCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    // Format recent interviews
    const formattedRecentInterviews = recentInterviews.map(interview => ({
      ...interview,
      id: interview._id.toString(),
      _id: undefined
    }));
    
    return NextResponse.json({
      totalInterviews,
      byStatus: statusMap,
      byType: typeMap,
      averageScore: scoreResult.length > 0 ? scoreResult[0].averageScore : 0,
      recentInterviews: formattedRecentInterviews
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 });
  }
}
