
import { GoogleGenAI, Type } from "@google/genai";
import { SecurityTip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSecurityTips = async (category: string): Promise<SecurityTip[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 practical and advanced cybersecurity tips for the category: ${category}. 
      The content should be in Vietnamese.
      Format as a JSON array with title, content, riskLevel (one of 'Low', 'Medium', 'High', 'Critical'), and category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "content", "riskLevel", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching tips:", error);
    return [];
  }
};

export const analyzeText = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Phân tích đoạn văn bản/URL/mã sau đây về các rủi ro an ninh mạng tiềm ẩn. 
      Cung cấp báo cáo chi tiết bao gồm: 1. Mức độ đe dọa, 2. Các lỗ hổng tiềm ẩn, 3. Biện pháp khắc phục. 
      Input: ${input}`,
      config: {
        systemInstruction: "Bạn là một chuyên gia an ninh mạng cao cấp với hơn 20 năm kinh nghiệm. Phân tích một cách khách quan và chính xác."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing text:", error);
    return "Không thể phân tích dữ liệu vào lúc này.";
  }
};

export const chatWithAI = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Bạn là CyberShield AI, một chuyên gia bảo mật hỗ trợ người dùng. Trả lời bằng tiếng Việt, phong cách chuyên nghiệp, hiện đại."
      }
    });
    
    // In this SDK version, history is typically passed during session creation but for simplicity we use generateContent if needed or basic chat
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    return "Tôi đang gặp sự cố kết nối. Hãy thử lại sau.";
  }
};
