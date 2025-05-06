// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Sign up parameters
export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
}

// Sign in parameters
export interface SignInParams {
  email: string;
  idToken: string;
}

// Interview type definition
export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  status: 'pending' | 'in-progress' | 'completed';
  score?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Feedback type definition
export interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  overallScore: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback?: string;
  createdAt: string;
  updatedAt: string;
}
