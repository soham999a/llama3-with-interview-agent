import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { replicateAdapter } from "@/lib/replicate-integration";

export async function POST(request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    console.log("Generating interview questions with Replicate...");
    console.log("Parameters:", { type, role, level, techstack, amount, userid });

    // Generate default questions in case the API call fails
    const defaultQuestions = [
      `Tell me about your experience with ${techstack}`,
      `What challenges have you faced as a ${role}?`,
      `How would you approach a problem in ${techstack}?`,
      `Describe a project where you used ${techstack}`,
      `What are your strengths and weaknesses as a ${role}?`
    ];

    let questions = defaultQuestions;

    try {
      // Use the Replicate adapter
      const { text: questionsText } = await replicateAdapter.generateText({
        prompt: `Prepare questions for a job interview.
          The job role is ${role}.
          The job experience level is ${level}.
          The tech stack used in the job is: ${techstack}.
          The focus between behavioural and technical questions should lean towards: ${type}.
          The amount of questions required is: ${amount}.
          Please return only the questions, without any additional text.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
          Return the questions formatted like this:
          ["Question 1", "Question 2", "Question 3"]

          IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON array. Do not use markdown formatting or code blocks. Do not include backticks.
        `
      });

      console.log("Raw response from Replicate:", questionsText);

      // Clean up the response to ensure it's valid JSON
      let cleanedResponse = questionsText.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```") && cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json|javascript)?\s*/, '').replace(/\s*```$/, '');
      }

      // Remove any non-JSON text before the array
      const arrayStartIndex = cleanedResponse.indexOf('[');
      const arrayEndIndex = cleanedResponse.lastIndexOf(']') + 1;

      if (arrayStartIndex >= 0 && arrayEndIndex > arrayStartIndex) {
        cleanedResponse = cleanedResponse.substring(arrayStartIndex, arrayEndIndex);
      }

      console.log("Cleaned response:", cleanedResponse);

      // Parse the cleaned JSON
      try {
        const parsedQuestions = JSON.parse(cleanedResponse);
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          questions = parsedQuestions;
          console.log("Successfully parsed questions:", questions);
        } else {
          console.log("Parsed JSON is not a valid array or is empty, using fallback questions");
        }
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);

        // Fallback: If we can't parse the JSON, extract questions manually
        const fallbackQuestions = questionsText
          .replace(/```(?:json|javascript)?\s*|\s*```/g, '') // Remove code blocks
          .split('\n')
          .filter(line => line.trim().startsWith('"') && line.includes('"')) // Find lines that look like questions
          .map(line => {
            // Extract the question text from the line
            const match = line.match(/"([^"]+)"/);
            return match ? match[1] : line.trim().replace(/[,"[\]]/g, '');
          })
          .filter(q => q.length > 0);

        if (fallbackQuestions.length > 0) {
          questions = fallbackQuestions;
          console.log("Using extracted questions:", questions);
        } else {
          console.log("Could not extract questions, using default questions");
        }
      }
    } catch (apiError) {
      console.error("Error calling Replicate API:", apiError);
      console.log("Using default questions due to API error");
    }

    // Ensure we have at least 5 questions
    if (questions.length < 5) {
      const additionalQuestions = defaultQuestions.slice(0, 5 - questions.length);
      questions = [...questions, ...additionalQuestions];
      console.log("Added additional questions to reach minimum of 5:", questions);
    }

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: typeof techstack === 'string' ? techstack.split(",") : techstack,
      questions: questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Saving interview to database:", interview);
    const docRef = await db.collection("interviews").add(interview);
    console.log("Interview saved with ID:", docRef.id);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error.toString() }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
