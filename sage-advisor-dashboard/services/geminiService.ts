
import { GoogleGenAI, Type } from "@google/genai";
import { SAGE_SYSTEM_PROMPT } from "../constants";
import { UserProfile, MaslowLevel, DashboardCard } from "../types";

// Always use the required initialization format and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSageRecommendations(profile: UserProfile): Promise<DashboardCard[]> {
  const currentTime = new Date().toLocaleTimeString();
  const prompt = `
    User Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Profession: ${profile.profession}
    - Current Maslow Level: ${profile.currentLevel}
    - Goals: ${profile.goals.join(", ")}
    - Aspirations: ${profile.aspirations}
    - Current Time: ${currentTime}
    
    Recommend 4-6 specific actions or cards for their dashboard today. 
    Include at least one time-sensitive food or activity suggestion.
    Suggest tasks that help them move towards the next level of Maslow's hierarchy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SAGE_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING },
              category: { type: Type.STRING },
              icon: { type: Type.STRING },
              timeContext: { type: Type.STRING },
            },
            required: ["id", "title", "description", "type", "category", "icon"],
          },
        },
      },
    });

    // Access .text property directly (it is not a method)
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Sage failed to generate recommendations:", error);
    return [];
  }
}

export async function analyzeJournalEntry(content: string) {
  const prompt = `Analyze this journal entry: "${content}". Provide a summary and identify which Maslow need it addresses.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Access .text property directly
    return response.text;
  } catch (error) {
    return "Sage is reflecting on your words...";
  }
}
