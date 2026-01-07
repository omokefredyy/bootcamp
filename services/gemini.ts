
import { GoogleGenAI, Type } from "@google/genai";

// Use Vite's import.meta.env for environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "mock-key";

// Initialize client safely
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the "Bootcamp Elite AI Tutor". Your goal is to help students with their fullstack development journey.
You are knowledgeable about React, Node.js, TypeScript, and software engineering best practices.
Keep your responses encouraging, concise, and professional. 
If a student asks about the bootcamp schedule or materials, advise them to check the relevant tabs in the dashboard, but you can also provide general technical help.
`;

export async function getAIResponse(chatHistory: any[]) {
  if (apiKey === "mock-key") {
    console.warn("Using mock API key. AI response will be simulated.");
    return "I am running in demo mode (no API key provided). Please configure VITE_GEMINI_API_KEY to enable real AI responses.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Updated to a more standard model or keep preview if intended
      contents: chatHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    // Fix: Access .text property directly (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment!";
  }
}

export async function summarizeLecture(topic: string, transcript: string) {
  if (apiKey === "mock-key") {
    return { summary: "Demo summary", keyPoints: ["Point 1", "Point 2"] };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Please summarize the following lecture titled "${topic}". 
      Transcript: ${transcript}
      Provide a structured summary in JSON format with two fields: "summary" (a 3-sentence overview) and "keyPoints" (an array of 5 important technical takeaways).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "keyPoints"]
        }
      }
    });

    const text = response.text ? response.text.trim() : "{}";
    // Note: Assuming .text is the property based on previous file comments. If it's a function using () might be needed, but let's trust the "Fix" comment for now.
    // Actually, safer to check the typing if I could, but I can't. I'll assume property based on "Fix: Access .text property directly".

    return JSON.parse(text);
  } catch (error) {
    console.error("Summarization Error:", error);
    return null;
  }
}