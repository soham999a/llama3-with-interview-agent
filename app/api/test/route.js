import { NextResponse } from 'next/server';
import { deepseekAdapter } from '@/lib/deepseek-integration';

export async function GET() {
  return NextResponse.json({ message: 'DeepSeek integration test API is working!' });
}

export async function POST(request) {
  try {
    const { prompt, type } = await request.json();

    if (type === 'question') {
      const { text } = await deepseekAdapter.generateText({
        prompt: prompt || 'Generate 3 interview questions for a Frontend Developer role.'
      });

      return NextResponse.json({ success: true, text });
    } else if (type === 'feedback') {
      const { object } = await deepseekAdapter.generateObject({
        prompt: prompt || 'Provide feedback on an interview where the candidate performed well.'
      });

      return NextResponse.json({ success: true, object });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type. Use "question" or "feedback".' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
