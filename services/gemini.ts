
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

export async function analyzeStruggle(chatContext: string) {
  if (apiKey === "mock-key") {
    // Return a chance-based struggle detection for demo if no API key
    if (chatContext.length > 50 && Math.random() > 0.7) {
      return { isStruggling: true, topic: "State Management", breakdown: "Student seems confused about how state updates are batch processed in React." };
    }
    return { isStruggling: false, topic: "", breakdown: "" };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Analyze the following chat context and determine if the student is struggling or stuck on a technical concept. Do not trigger for casual conversation.
      
      Chat Context: ${chatContext}
      
      Respond in JSON format with:
      1. "isStruggling": boolean
      2. "topic": string (the core concept they are stuck on, empty if not struggling)
      3. "breakdown": string (1-sentence summary of the confusion, empty if not struggling)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isStruggling: { type: Type.BOOLEAN },
            topic: { type: Type.STRING },
            breakdown: { type: Type.STRING }
          },
          required: ["isStruggling", "topic", "breakdown"]
        }
      }
    });

    return JSON.parse(response.text || '{"isStruggling": false}');
  } catch (error) {
    console.error("Struggle Analysis Error:", error);
    return { isStruggling: false, topic: "", breakdown: "" };
  }
}

export async function auditAssignment(repoUrl: string, notes: string, bootcampCategory: string = "General") {
  if (apiKey === "mock-key") {
    return {
      feedback: `Your ${bootcampCategory} submission looks professional. Ensure your presentation is clean and all links are accessible.`,
      scoreMeter: 75,
      improvements: ["Add more detailed documentation", "Check for link accessibility", "Improve visual formatting"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `You are an Elite Professional Auditor for a ${bootcampCategory} academy. 
      Audit the following student project submission.
      
      Project Link/Resource: ${repoUrl}
      Student Context: ${notes}
      
      Professional Standards to consider for ${bootcampCategory}:
      - Technical accuracy and depth.
      - Quality of documentation/presentation.
      - Professional 'Readiness' for the industry.
      
      Provide structural and professional feedback on what they can improve before a human tutor reviews it.
      
      Respond in JSON format with:
      1. "feedback": string (2-3 sentences of overall tone and subject-specific advice)
      2. "scoreMeter": number (0-100 based on 'readiness' for professional review)
      3. "improvements": Array<string> (at least 3 specific, actionable points tailored to ${bootcampCategory})`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            scoreMeter: { type: Type.NUMBER },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["feedback", "scoreMeter", "improvements"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Audit Error:", error);
    return null;
  }
}