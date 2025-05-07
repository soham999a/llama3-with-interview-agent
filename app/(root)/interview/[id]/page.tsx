import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.server";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-600">
            Interview Details
          </h1>
        </div>

        <div className="bg-white rounded-[1.25rem] p-6 border border-gray-200 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-teal-100 flex items-center justify-center shadow-md">
                <Image
                  src={getRandomInterviewCover()}
                  alt="cover-image"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg capitalize">
                  {interview.role} Interview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-teal-100 text-teal-600 px-2 py-0.5 rounded-[1.25rem] text-xs font-medium">
                    {interview.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <DisplayTechIcons techStack={interview.techstack} />
            </div>
          </div>

          <Agent
            userName={user?.name!}
            userId={user?.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
          />
        </div>
      </div>
    </>
  );
};

export default InterviewDetails;
