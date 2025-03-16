import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { ReceiptBase } from '../../../../types/receipt';
import prisma from "@/lib/prismaClient";

import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';


export async function POST(req: NextApiRequest) {

    // Current user:
     // Retrieve the logged-in user's email from the session
     const session = await getServerSession(authOptions);

     if (!session || !session.user || !session.user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
 
     const userEmail = session.user.email;
 
     if(!userEmail) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
     }
 
     const foundUser = await prisma.user.findUnique({
       where: { email: userEmail },
     });
 
 
     if(!foundUser) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
     }


    const receiptBase: ReceiptBase = {
        storeName: req.body.storeName,
        totalSum: req.body.totalSum,
        currency: req.body.currency,
        items: req.body.items,
        userId : foundUser.id
    };

    try {
        const receipt = await prisma.receipt.create({
            data: {
                ...receiptBase
            },
        });

        return NextResponse.json(receipt, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating receipt' }, { status: 500 });
    }
}

export async function GET(req: NextApiRequest) {
    // Current user:
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    if (!userEmail) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const foundUser = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!foundUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const receipts = await prisma.receipt.findMany({
            where: { userId: foundUser.id },
        });
        return NextResponse.json(receipts, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Error retrieving receipts' }, { status: 500 });
    }
}
