import { NextResponse } from "next/server";

import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    // Store text in database
    const { text, readerType } = await req.json();


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

    const newTextRecord = await prisma.textRecord.create({
      data: { text, userId: foundUser.id, readerType  },
    });

    return NextResponse.json({ success: true, record: newTextRecord });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
export async function GET() {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user) { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail =  session.user.email;

    if(!userEmail) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if(!foundUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    } 

    // Retrieve all text records for the logged-in user from the database
    const textRecords = await prisma.textRecord.findMany({
      where: { userId: foundUser.id },
    });

    console.log("Retrieved text records for user:", foundUser, textRecords);

    return NextResponse.json({ success: true, records: textRecords });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}