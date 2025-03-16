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
        
        // Here you would parse the extractedText to map it to the Receipt and ReceiptItem structure
        // This is a simplified example and assumes the extracted text is in a structured format
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
        const parsed = JSON.parse(text);
        return {
            // id: "some-uuid",
            storeName: parsed.storeName || "Unknown Store",
            totalSum: parsed.totalSum || 0,
            currency: parsed.currency || "NOK",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: parsed.items.map((item: any) => ({
                // id: "item-uuid",
                itemName: item.name || "Unknown Item",
                price: item.price || 0,
                createdAt: new Date(),
                receiptId: "some-uuid",
                // receipt: {
                //     id: "some-uuid",
                //     storeName: parsed.storeName || "Unknown Store",
                //     totalSum: parsed.totalSum || 0,
                //     createdAt: new Date(),
                //     currency: parsed.currency || "USD",
                //     items: []
                // },
            })),
        };
    } catch (error) {
        console.error("Failed to parse receipt text:", error);
        throw new Error("Invalid receipt format");
    }
}
