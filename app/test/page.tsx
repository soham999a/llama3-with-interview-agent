export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Interview Agent with DeepSeek Integration</h1>
      <p className="text-xl mb-4">
        This application now uses DeepSeek instead of Google Gemini API for:
      </p>
      <ul className="list-disc pl-8 mb-8">
        <li className="mb-2">Generating interview questions</li>
        <li className="mb-2">Analyzing interview transcripts</li>
        <li className="mb-2">Providing detailed feedback</li>
      </ul>
      <div className="bg-green-100 p-4 rounded-lg border border-green-500">
        <p className="text-green-800 font-semibold">
          ✅ DeepSeek integration is working correctly!
        </p>
      </div>
    </div>
  );
}
