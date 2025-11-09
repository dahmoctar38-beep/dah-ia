
import { GoogleGenAI, Type } from "@google/genai";
import type { Prediction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    homeTeam: { type: Type.STRING, description: "Full name of the home team." },
    awayTeam: { type: Type.STRING, description: "Full name of the away team." },
    mostLikelyScore: {
      type: Type.OBJECT,
      properties: {
        home: { type: Type.INTEGER, description: "Predicted goals for the home team." },
        away: { type: Type.INTEGER, description: "Predicted goals for the away team." },
        probability: { type: Type.NUMBER, description: "Probability of this exact score (0.0 to 1.0)." }
      },
      required: ["home", "away", "probability"]
    },
    hdaProbability: {
      type: Type.OBJECT,
      properties: {
        homeWin: { type: Type.NUMBER, description: "Probability of home team winning (0.0 to 1.0)." },
        draw: { type: Type.NUMBER, description: "Probability of a draw (0.0 to 1.0)." },
        awayWin: { type: Type.NUMBER, description: "Probability of away team winning (0.0 to 1.0)." }
      },
      required: ["homeWin", "draw", "awayWin"]
    },
    overUnder: {
      type: Type.OBJECT,
      properties: {
        over1_5: { type: Type.NUMBER, description: "Probability of total goals being over 1.5 (0.0 to 1.0)." },
        over2_5: { type: Type.NUMBER, description: "Probability of total goals being over 2.5 (0.0 to 1.0)." }
      },
      required: ["over1_5", "over2_5"]
    },
    weather: {
      type: Type.OBJECT,
      properties: {
        condition: { type: Type.STRING, description: "Brief description of the weather conditions (e.g., 'Clear, 15°C'). If unknown, state 'Not available'." },
        impact: { type: Type.STRING, description: "How the weather might impact the game (e.g., 'Ideal conditions' or 'Rain may slow down play')." }
      },
      required: ["condition", "impact"]
    },
    analysis: { type: Type.STRING, description: "A detailed analysis (3-4 sentences) explaining the prediction. Mention team form, H2H record, and key players if relevant." }
  },
  required: ["homeTeam", "awayTeam", "mostLikelyScore", "hdaProbability", "overUnder", "weather", "analysis"]
};

const systemInstruction = `You are D7A0HO, an expert football intelligence system. Your task is to analyze a football match from a given SofaScore or BeSoccer URL and provide a detailed, data-driven prediction.
- First, identify the home and away teams from the URL.
- Research their recent form (last 5-10 matches), head-to-head (H2H) history, and current league standing.
- Identify the city of the match to infer potential weather conditions.
- Synthesize all this information into a probabilistic forecast.
- If half-time scores are provided, adjust your second-half prediction accordingly, noting that the dynamics of the game have changed.
- Provide your final analysis in the exact JSON format defined by the schema. The analysis text should be concise but insightful.`;

export async function getPrediction(url: string, htHome?: number, htAway?: number): Promise<Prediction> {
  let prompt = `Analyze the match from this URL: ${url}`;
  if (typeof htHome === 'number' && typeof htAway === 'number') {
    prompt += `\nThe match is at half-time with the score: Home ${htHome} - ${htAway} Away. Please adjust your prediction for the final result based on this HT score.`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });
    
    const jsonString = response.text.trim();
    if (!jsonString) {
        throw new Error("Received an empty response from the AI model.");
    }

    const predictionData: Prediction = JSON.parse(jsonString);
    return predictionData;

  } catch (e) {
    console.error("Error calling Gemini API:", e);
    let message = "Failed to parse prediction data.";
    if (e instanceof Error) {
        message = e.message;
    }
    throw new Error(`AI analysis failed: ${message}`);
  }
}
