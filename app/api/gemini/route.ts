// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { streamText } from 'ai';

// const gemini = createGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const result = streamText({
//     model: gemini.chat(),
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export async function POST(req: Request) {
  try {
    const { category, total, budget, level } = await req.json();

    const prompt =
      level === 'strong'
        ? `I've spent $${total} on ${category}, but my monthly budget is $${budget}. Give a strong, urgent saving tip.`
        : `I've spent $${total} on ${category}, and my monthly budget is $${budget}. Give a mild, friendly suggestion to reduce spending.`;

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a financial assistant for a Cantonese-speaking expense tracking app. Response in Cantonese.",
        },
      });
    
      const text = response.text;


    return new Response(JSON.stringify({ suggestion: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Gemini API Error]', err);
    return new Response(
      JSON.stringify({ error: 'Gemini API failed to respond.' }),
      { status: 500 }
    );
  }
}
