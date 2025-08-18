"use server";

import { generateSummarySchema, GenerateSummaryValues } from "@/lib/validation";
import AI from "@/lib/ai";

export async function generateSummary(input: GenerateSummaryValues) {
  //TODO: Block for non-preimum users

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary 
    for a resume given the user's provided data. Only return the summary and do not include any other
    information in the response. Keep it concise and professional.
  `;

  const userMessage = `
    Please generate a professional resume summary from this data:
    Job title: ${jobTitle || "N/A"}
    Work Experiences: ${workExperiences
      ?.map(
        (exp) => `Position: ${exp.position || "N/A"} 
        at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
        Description: ${exp.description || "N/A"}
    `,
      )
      .join("\n\n")}
    Education: ${educations
      ?.map(
        (edu) => `Degree: ${edu.degree || "N/A"} 
        at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
    `,
      )
      .join("\n\n")}
    
    Skills:${skills} 
  `;
  
  const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
    {
        role: "system",
        content: systemMessage
    },
    {
        role: "user",
        content: userMessage,
    },
    ],
  });

  const aiResponse = response.choices[0].message.content;

  if(!aiResponse){
    throw new Error("Failed to generate AI response");
  }
  return aiResponse;
}
