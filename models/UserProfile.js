import mongoose from 'mongoose';

// Define schema if mongoose is used
const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    default: '',
  },
  jobTitle: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number, // in years
    default: 0,
  },
  targetRole: {
    type: String,
    default: '',
  },
  preferredInterviewTypes: {
    type: [String],
    default: [],
  },
  completedInterviews: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
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
UserProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Helper method to convert MongoDB document to a plain object
UserProfileSchema.methods.toJSON = function() {
  const profile = this.toObject();
  profile.id = profile._id.toString();
  delete profile._id;
  delete profile.__v;
  return profile;
};

// Export the model if mongoose is being used
export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

// For native MongoDB driver usage
export const getUserProfilesCollection = async (db) => {
  return db.collection('userProfiles');
};

// Helper functions for MongoDB native driver
export const userProfileToJSON = (profile) => {
  if (!profile) return null;
  return {
    ...profile,
    id: profile._id.toString(),
    _id: undefined,
  };
};
