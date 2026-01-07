
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Correctly initialize GoogleGenAI with named parameter as per @google/genai guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Bootcamp Elite AI Tutor". Your goal is to help students with their fullstack development journey.
You are knowledgeable about React, Node.js, TypeScript, and software engineering best practices.
Keep your responses encouraging, concise, and professional. 
If a student asks about the bootcamp schedule or materials, advise them to check the relevant tabs in the dashboard, but you can also provide general technical help.
`;

export async function getAIResponse(chatHistory: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    // Fix: Ensure text is accessed correctly and handle potential undefined before parsing
    const text = response.text?.trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Summarization Error:", error);
    return null;
  }
}