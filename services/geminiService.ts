
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

export const getAIResponse = async (prompt: string, portfolioData: PortfolioData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the AI Assistant for ${portfolioData.name}'s professional portfolio.
    Your goal is to answer questions about ${portfolioData.name} based on the following data:
    
    Name: ${portfolioData.name}
    Role: ${portfolioData.title}
    About: ${portfolioData.about}
    Skills: ${portfolioData.skills.map(s => s.name).join(', ')}
    Experience: ${portfolioData.experience.map(e => `${e.role} at ${e.company} (${e.period})`).join('; ')}
    Email: ${portfolioData.email}
    Social: LinkedIn (${portfolioData.linkedin}), GitHub (${portfolioData.github}), Facebook (${portfolioData.facebook || 'N/A'}), WhatsApp (${portfolioData.whatsapp || 'N/A'})
    
    Be professional, helpful, and concise. If you don't know the answer, politely suggest contacting ${portfolioData.name} directly.
    Always maintain a modern, tech-savvy persona.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to my brain (Gemini API). Please check your connection.";
  }
};
