import mongoose from 'mongoose';

// Define schema if mongoose is used instead of native MongoDB driver
const InterviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'system', 'leadership', 'product', 'problem'],
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  questions: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number,
  }],
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  scheduledFor: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create or update timestamps
InterviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to convert MongoDB document to a plain object
InterviewSchema.methods.toJSON = function() {
  const interview = this.toObject();
  interview.id = interview._id.toString();
  delete interview._id;
  delete interview.__v;
  return interview;
};

// Export the model if mongoose is being used
export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);

// For native MongoDB driver usage
export const getInterviewsCollection = async (db) => {
  return db.collection('interviews');
};

// Helper functions for MongoDB native driver
export const interviewToJSON = (interview) => {
  if (!interview) return null;
  return {
    ...interview,
    id: interview._id.toString(),
    _id: undefined,
  };
};
