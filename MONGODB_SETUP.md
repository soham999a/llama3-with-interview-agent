# MongoDB Backend Setup

This document provides instructions for setting up the MongoDB backend for the LLAMA3 Interview Agent application.

## Overview

The application uses:
- **MongoDB** for storing interview data, feedback, and user profiles
- **Firebase Authentication** for user authentication
- **Next.js API Routes** for backend API endpoints

## Setup Instructions

### 1. MongoDB Setup

1. Create a MongoDB Atlas account or use an existing one
2. Create a new cluster or use an existing one
3. Create a new database named `interview-agent`
4. Create the following collections:
   - `interviews`
   - `feedback`
   - `userProfiles`
5. Get your MongoDB connection string from Atlas

### 2. Firebase Setup

1. Create a Firebase project or use an existing one
2. Enable Email/Password authentication
3. Get your Firebase configuration values

### 3. Environment Variables

1. Copy the `.env.example` file to `.env.local`
2. Fill in your MongoDB connection string and Firebase configuration values

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-agent?retryWrites=true&w=majority
MONGODB_DB=interview-agent

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Install Dependencies

Make sure to install the required dependencies:

```bash
npm install mongodb firebase
# or
yarn add mongodb firebase
```

## API Endpoints

The following API endpoints are available:

### Interviews

- `GET /api/interviews` - Get all interviews for the current user
- `POST /api/interviews` - Create a new interview
- `GET /api/interviews/:id` - Get a specific interview
- `PUT /api/interviews/:id` - Update an interview
- `DELETE /api/interviews/:id` - Delete an interview

### Feedback

- `GET /api/interviews/:id/feedback` - Get feedback for a specific interview
- `POST /api/interviews/:id/feedback` - Create feedback for an interview
- `PUT /api/interviews/:id/feedback` - Update feedback for an interview

### User Profile

- `GET /api/user/profile` - Get the current user's profile
- `PUT /api/user/profile` - Update the current user's profile

### User Statistics

- `GET /api/user/stats` - Get the current user's interview statistics

## Data Models

### Interview

```javascript
{
  userId: String,
  title: String,
  type: String, // 'technical', 'behavioral', 'system', 'leadership', 'product', 'problem'
  techStack: [String],
  status: String, // 'scheduled', 'in-progress', 'completed', 'cancelled'
  score: Number,
  feedback: String,
  questions: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number,
  }],
  duration: Number, // in minutes
  scheduledFor: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
```

### Feedback

```javascript
{
  interviewId: ObjectId,
  userId: String,
  overallScore: Number,
  technicalScore: Number,
  communicationScore: Number,
  problemSolvingScore: Number,
  summary: String,
  strengths: [String],
  areasForImprovement: [String],
  detailedFeedback: String,
  createdAt: Date,
  updatedAt: Date,
}
```

### User Profile

```javascript
{
  userId: String,
  name: String,
  email: String,
  photoURL: String,
  jobTitle: String,
  skills: [String],
  experience: Number, // in years
  targetRole: String,
  preferredInterviewTypes: [String],
  completedInterviews: Number,
  averageScore: Number,
  createdAt: Date,
  updatedAt: Date,
}
```

## Integration with Firebase Authentication

The application uses Firebase for authentication and MongoDB for data storage. When a user signs up or signs in, their profile is automatically created or updated in MongoDB.

The `auth.action.js` file contains the integration code between Firebase and MongoDB.

## Security Considerations

- API routes check for authentication before allowing access to data
- Users can only access their own data
- Firebase authentication tokens are stored in HTTP-only cookies
- MongoDB connection string is stored in environment variables
