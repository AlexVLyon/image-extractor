import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { ReceiptBase } from '../../../../../types/receipt';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const { image } = await req.json();
    const base64Image = image.split(",")[1]; // Assuming the image is in data URL format
    if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{
            role: "user",
            content: [
                { type: "text", text: "Extract and return the receipt details in a JSON structure. The JSON should include store name, total sum, currency, and items with their names and prices. Ensure the items are in a structured manner every time. Do not provide a description or any additional details." },
                {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                },
                },
            ],
            }],
        });

        const extractedText = completion.choices?.[0]?.message?.content || "No text found.";
        const receipt = parseReceipt(extractedText);

        console.log("Extracted receipt:", receipt);

        return NextResponse.json(receipt);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to process image." }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

function parseReceipt(text: string): ReceiptBase {
    try {
        console.log("text before parsing", text);
        const cleanedText = text.replace(/^```json\s*/, '').replace(/```$/, '');

        console.log("text after cleaning", cleanedText);

        const parsed = JSON.parse(cleanedText);

        console.log("text after parsing", parsed);

        return {
            storeName: parsed?.store_name || "Unknown Store",
            totalSum: parsed?.total_sum || 0,
            currency: parsed?.currency || "NOK",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: parsed.items.map((item: any) => ({
                itemName: item?.name || "Unknown Item",
                price: item?.price || 0,
                createdAt: new Date(),
            })),
        };
    } catch (error) {
        console.error("Failed to parse receipt text:", error);
        throw new Error("Invalid receipt format");
    }
}
