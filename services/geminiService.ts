import { GoogleGenAI } from "@google/genai";
import { Product, SaleTransaction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAiInsights = async (
  query: string,
  products: Product[],
  sales: SaleTransaction[]
): Promise<string> => {
  if (!API_KEY) {
    return "AI features are disabled. Please set the API_KEY environment variable.";
  }
  
  try {
    const model = 'gemini-2.5-flash';
    
    const today = new Date().toISOString();

    const prompt = `
      You are an expert data analyst for a retail Point of Sale system.
      Analyze the provided JSON data to answer the user's question.
      Provide a concise and direct answer. Format your response using Markdown for clarity (e.g., use lists, bold text).
      Today's date is ${today}. Sales timestamps are in ISO 8601 format.

      Here is the available data:
      
      PRODUCTS:
      ${JSON.stringify(products, null, 2)}

      SALES TRANSACTIONS:
      ${JSON.stringify(sales, null, 2)}

      User's Question: "${query}"

      Answer:
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI model: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI model.";
  }
};