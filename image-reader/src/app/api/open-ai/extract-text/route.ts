import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const { image } = await req.json();
    const base64Image = image.split(",")[1]; // Assuming the image is in data URL format
    if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: "what's in this image?" },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`,
                        },
                    },
                ],
            }],
        });

        return NextResponse.json({ text: completion.choices?.[0]?.message?.content || "No text found." });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to process image." }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
