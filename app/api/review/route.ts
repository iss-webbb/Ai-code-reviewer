import { NextResponse, NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.code || !body.lang) {
      return NextResponse.json(
        { error: "code and languge are required" },
        { status: 400 },
      );
    }

    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
    const interaction = await client.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `review this ${body.lang} code and give feedback: ${body.code}`,
    });

    return NextResponse.json(
      { Message: interaction.output_text, data: body },
      { status: 201 },
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "failed to process request" },
      { status: 500 },
    );
  }
}
