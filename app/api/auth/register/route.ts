import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/utils/password";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Check if user already exists
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));
        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        const passwordHash = hashPassword(password);
        const userId = crypto.randomUUID();

        await db.insert(users).values({
            id: userId,
            email,
            name: name || null,
            passwordHash,
            tier: "free",
        });

        return NextResponse.json({ success: true, message: "User registered successfully" });
    } catch (error: unknown) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
