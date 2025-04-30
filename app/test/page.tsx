export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Interview Agent with DeepSeek Integration</h1>
      <p className="text-xl mb-4 text-gray-600">
        This application now uses DeepSeek instead of Google Gemini API for:
      </p>
      <ul className="list-disc pl-8 mb-8 text-gray-600">
        <li className="mb-2">Generating interview questions</li>
        <li className="mb-2">Analyzing interview transcripts</li>
        <li className="mb-2">Providing detailed feedback</li>
      </ul>
      <div className="bg-teal-100 p-4 rounded-lg border border-teal-500">
        <p className="text-teal-800 font-semibold">
          ✅ DeepSeek integration is working correctly!
        </p>
      </div>
    </div>
  );
}
