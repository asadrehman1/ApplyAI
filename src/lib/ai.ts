import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
export default AI;
