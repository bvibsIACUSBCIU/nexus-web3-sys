import { GoogleGenAI } from "@google/genai";
import { ChatMessage, BotPersona } from '../types';

// Defer initialization to prevent crash if API_KEY is missing during build time
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiInstance) {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
    if (!API_KEY) {
      console.warn("Gemini API Key is missing. AI features will be unavailable.");
    }
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
};

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Summarizes a list of chat messages to provide a daily report.
 */
export const generateChatSummary = async (messages: ChatMessage[], groupName: string): Promise<string> => {
  try {
    const chatLog = messages.map(m => `${m.sender}: ${m.content}`).join('\n');

    const prompt = `
      Act as a Community Manager for a Web3 Project.
      Analyze the following chat log from the Telegram group "${groupName}".
      
      Output a concise summary **in Chinese (Simplified)** including:
      1. Main topics discussed (主要讨论话题).
      2. General sentiment (Bullish/Bearish/Neutral) (整体情绪：看涨/看跌/中性).
      3. Any FUD (Fear, Uncertainty, Doubt) detected (是否有 FUD 言论).
      4. Actionable items for the team (团队待办事项).

      Chat Log:
      ${chatLog}
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "无法生成总结。";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "错误：无法连接到 AI 服务。";
  }
};

/**
 * Generates a "Hype" message based on a persona to stimulate community activity.
 */
export const generateHypeMessage = async (persona: BotPersona, context: string): Promise<string> => {
  try {
    const prompt = `
      You are a Telegram bot with the persona: ${persona.name}.
      Role: ${persona.role}.
      Tone: ${persona.tone}.
      
      Current context/topic in the group: ${context}.
      
      Generate a short, natural-sounding message **in Chinese (Simplified)** to engage the community. 
      Do not use hashtags. Keep it under 30 words.
      Make it sound like a real crypto user (leek/degen), using Chinese crypto slang (e.g., 冲, 牛逼, 拿住, 纸手) if appropriate for the tone.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "冲冲冲！LFG！";
  } catch (error) {
    console.error("Error generating hype:", error);
    return "项目看起来很稳！🚀";
  }
};