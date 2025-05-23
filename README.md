# Llama3 with Interview Agent

A job interview preparation platform powered by Llama3 AI model. This project uses Llama3 through Hugging Face for generating interview questions and providing feedback on interview responses.

## Features

- Generate interview questions based on job role, experience level, and tech stack
- Conduct mock interviews with voice interaction
- Receive detailed feedback on your interview performance
- Track your progress over time

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Llama3 via Hugging Face (production) or Ollama (development)
- **Voice Interface**: Vapi

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Ollama (for local AI model)
- Firebase account
- Vapi account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/soham999a/llama3-with-interview-agent.git
cd llama3-with-interview-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
# Local AI Configuration
OLLAMA_ENDPOINT=http://localhost:11434/api/generate
DEEPSEEK_API_URL=http://localhost:11434/api
DEEPSEEK_MODEL=llama3

# Hugging Face Configuration (for production)
HUGGINGFACE_API_TOKEN=your_huggingface_api_token
HUGGINGFACE_MODEL=meta-llama/Llama-3-8b-chat-hf

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Vapi Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

# Application Settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Firebase credentials and Hugging Face API token.

4. Start Ollama with the Llama3 model:
```bash
ollama run llama3
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure the project:
   - Set the Framework Preset to "Next.js"
   - Add the environment variables from `.env.production`
   - Make sure to include your Hugging Face API token
6. Click "Deploy"

Your application will be deployed and available at a Vercel URL.

### Getting a Hugging Face API Token

1. Sign up for a [Hugging Face](https://huggingface.co) account
2. Go to your profile settings and create a new API token
3. Add this token to your Vercel environment variables as `HUGGINGFACE_API_TOKEN`
