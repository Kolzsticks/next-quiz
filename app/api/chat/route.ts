import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a very helpful assistant." },
        { role: "user", content: message },
      ],
      model: "qwen-2.5-32b",
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null,
    });

    const botResponse = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error("Error in /chat API route:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
