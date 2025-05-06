import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) return NextResponse.json({ error: "error registrering" }, { status: 404 });


    const hashedPassword = await hash(password, 10);

    try {
         
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        } else {
            console.log(error)
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
};
