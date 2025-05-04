import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

// Get the MongoDB database instance
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'interview-agent');
}

// Generic CRUD operations for any collection

// Create a document in a collection
export async function createDocument(collection, document) {
  const db = await getDatabase();
  const result = await db.collection(collection).insertOne(document);
  return { ...document, _id: result.insertedId };
}

// Get a document by ID
export async function getDocumentById(collection, id) {
  const db = await getDatabase();
  return db.collection(collection).findOne({ _id: new ObjectId(id) });
}

// Get documents by a field value
export async function getDocumentsByField(collection, field, value) {
  const db = await getDatabase();
  return db.collection(collection).find({ [field]: value }).toArray();
}

// Update a document
export async function updateDocument(collection, id, updates) {
  const db = await getDatabase();
  const result = await db.collection(collection).updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

// Delete a document
export async function deleteDocument(collection, id) {
  const db = await getDatabase();
  const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Interview-specific operations

// Get all interviews for a user
export async function getUserInterviews(userId) {
  return getDocumentsByField('interviews', 'userId', userId);
}

// Get completed interviews for a user
export async function getCompletedInterviews(userId) {
  const db = await getDatabase();
  return db.collection('interviews')
    .find({ userId, status: 'completed' })
    .sort({ completedAt: -1 })
    .toArray();
}

// Get interview statistics for a user
export async function getUserInterviewStats(userId) {
  const db = await getDatabase();
  
  // Get count of interviews by status
  const statusCounts = await db.collection('interviews').aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]).toArray();
  
  // Get average score for completed interviews
  const scoreResult = await db.collection('interviews').aggregate([
    { $match: { userId, status: 'completed', score: { $ne: null } } },
    { $group: { _id: null, averageScore: { $avg: '$score' } } }
  ]).toArray();
  
  // Get count by interview type
  const typeCounts = await db.collection('interviews').aggregate([
    { $match: { userId } },
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]).toArray();
  
  // Format the results
  const statusMap = statusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  
  const typeMap = typeCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  
  return {
    total: statusCounts.reduce((sum, curr) => sum + curr.count, 0),
    byStatus: statusMap,
    byType: typeMap,
    averageScore: scoreResult.length > 0 ? scoreResult[0].averageScore : 0
  };
}

// Feedback-specific operations

// Get all feedback for an interview
export async function getInterviewFeedback(interviewId) {
  return getDocumentsByField('feedback', 'interviewId', new ObjectId(interviewId));
}

// User profile operations

// Get or create user profile
export async function getOrCreateUserProfile(userId, userData) {
  const db = await getDatabase();
  const profile = await db.collection('userProfiles').findOne({ userId });
  
  if (profile) {
    return profile;
  }
  
  // Create new profile if it doesn't exist
  const newProfile = {
    userId,
    name: userData.name || 'User',
    email: userData.email || '',
    photoURL: userData.photoURL || '',
    jobTitle: '',
    skills: [],
    experience: 0,
    targetRole: '',
    preferredInterviewTypes: [],
    completedInterviews: 0,
    averageScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('userProfiles').insertOne(newProfile);
  return { ...newProfile, _id: result.insertedId };
}

// Update user statistics after interview completion
export async function updateUserStats(userId) {
  const db = await getDatabase();
  
  // Get completed interviews count
  const completedCount = await db.collection('interviews').countDocuments({ 
    userId, 
    status: 'completed' 
  });
  
  // Get average score
  const scoreResult = await db.collection('interviews').aggregate([
    { $match: { userId, status: 'completed', score: { $ne: null } } },
    { $group: { _id: null, averageScore: { $avg: '$score' } } }
  ]).toArray();
  
  const averageScore = scoreResult.length > 0 ? scoreResult[0].averageScore : 0;
  
  // Update user profile
  await db.collection('userProfiles').updateOne(
    { userId },
    { 
      $set: { 
        completedInterviews: completedCount,
        averageScore,
        updatedAt: new Date()
      } 
    }
  );
  
  return { completedInterviews: completedCount, averageScore };
}
