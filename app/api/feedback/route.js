// Redirect to the new feedback endpoint
export async function POST(request) {
  const url = new URL(request.url);
  const newUrl = url.origin + '/api/feedback-new';

  // Forward the request to the new endpoint
  const response = await fetch(newUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
  });

  return response;
}

export async function GET() {
  return Response.json({ success: true, data: "Feedback API is working! Redirecting to new endpoint." }, { status: 200 });
}
