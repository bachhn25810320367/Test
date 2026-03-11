import { GoogleGenAI } from "@google/genai";
import { Asset, PlacedLayer } from "../types";

export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Prepare the prompt for the model
  const systemInstruction = `You are a professional product mockup designer. 
  Your task is to composite logos onto product images with realistic lighting, shadows, and perspective warping.
  The user will provide a base product image and one or more logos with their relative placements.
  You must return a high-quality, realistic image of the product with the logos applied.
  CRITICAL: Ensure the edges of the logos are perfectly blended into the product's surface texture. If the product has a specific material (like fabric or plastic), the logo should inherit that texture.`;

  const contents = [
    {
      text: `Base Product: ${product.name}. 
      Logos to apply: ${layers.map(l => l.asset.name).join(", ")}.
      User Instructions: ${prompt || "Apply the logos realistically to the product."}
      
      Placement details (percentage from top-left):
      ${layers.map(l => `- ${l.asset.name}: x=${l.placement.x}%, y=${l.placement.y}%, scale=${l.placement.scale}, rotation=${l.placement.rotation}°`).join("\n")}`
    },
    {
      inlineData: {
        data: product.data.split(",")[1],
        mimeType: product.mimeType
      }
    },
    ...layers.map(l => ({
      inlineData: {
        data: l.asset.data.split(",")[1],
        mimeType: l.asset.mimeType
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: contents },
    config: {
      systemInstruction,
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate mockup image.");
};

export const generateAsset = async (prompt: string, type: 'logo' | 'product'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: `Generate a high-quality ${type} image based on this description: ${prompt}. 
    If it's a logo, it should be on a clean, solid background (preferably white or transparent-looking).
    If it's a product, it should be a clean product shot on a neutral background.`,
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error(`Failed to generate ${type}.`);
};

export const generateRealtimeComposite = async () => {
  // Placeholder for future implementation if needed
  return "";
};
