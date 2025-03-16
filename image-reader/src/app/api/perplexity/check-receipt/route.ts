import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai',
  });


  async function queryPerplexity(prompt: string) {

    try {
      const response = await perplexity.chat.completions.create({
        model: 'sonar-pro', // Ensure this model is correct and available
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        stream: false,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error querying Perplexity:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 400 && (error as any).type === 'invalid_model') {
        console.error('Invalid model specified. Please check the model name.');
      }

      console.log("Error querying Perplexity:", error);
      return null;
    }
  }

export async function POST(req: NextRequest) {
    const { receipt, question } = await req.json();

    if (!receipt) {
      console.log("No receipt provided");
        return NextResponse.json({ error: "No receipt provided" }, { status: 400 });
    }

    try {
      const promptIncludingPredefinedQuery = `
        I have a receipt and I want to analyze it based on a question. 
        The receipt is presented in JSON. Don't answer in a too technical way. 
        Answer in a way that makes sense to a frontend user that does not know anything about technology. 
        Just about the receipt. There is also a question from the user: ${question} 
         Receipt Data: \n ${JSON.stringify(receipt)}
      `;

        const response = await queryPerplexity(promptIncludingPredefinedQuery);
        const receiptAnalysis = response || "No analysis found.";

        return NextResponse.json({ receiptAnalysis });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to process receipt." }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

