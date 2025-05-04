import mongoose from 'mongoose';

// Define schema if mongoose is used
const FeedbackSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  problemSolvingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  summary: {
    type: String,
    required: true,
  },
  strengths: {
    type: [String],
    default: [],
  },
  areasForImprovement: {
    type: [String],
    default: [],
  },
  detailedFeedback: {
    type: String,
    default: '',
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
FeedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to convert MongoDB document to a plain object
FeedbackSchema.methods.toJSON = function() {
  const feedback = this.toObject();
  feedback.id = feedback._id.toString();
  delete feedback._id;
  delete feedback.__v;
  return feedback;
};

// Export the model if mongoose is being used
export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

// For native MongoDB driver usage
export const getFeedbackCollection = async (db) => {
  return db.collection('feedback');
};

// Helper functions for MongoDB native driver
export const feedbackToJSON = (feedback) => {
  if (!feedback) return null;
  return {
    ...feedback,
    id: feedback._id.toString(),
    _id: undefined,
  };
};
