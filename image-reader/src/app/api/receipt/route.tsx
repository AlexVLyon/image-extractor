import { NextResponse } from 'next/server';
import prisma from "@/lib/prismaClient";

import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';


export async function POST(req: Request) {


    const { storeName, totalSum, currency, items } = await req.json();

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


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsMapped = items.map((item: any) => ({
       itemName: item.itemName,
       price: item.price,
    }));

    try {
       const receipt = await prisma.receipt.create({
          data: {
             storeName: storeName ?? "Unknown",
             totalSum: totalSum ?? 0,
             currency: currency ?? "NOK",
             userId: foundUser.id,
             items: {
                create: itemsMapped
             }
          },
       });

        return NextResponse.json(receipt, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating receipt' }, { status: 500 });
    }
}

export async function GET() {
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
            include: { items: true },
        });

        console.log("receipts", receipts);
        return NextResponse.json(receipts, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Error retrieving receipts' }, { status: 500 });
    }
}
