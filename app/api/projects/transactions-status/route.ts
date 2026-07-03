import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userTransactions = await db
            .select({
                id: transactions.id,
                projectId: transactions.projectId,
                status: transactions.status,
            })
            .from(transactions)
            .where(eq(transactions.userId, userId));

        return NextResponse.json(userTransactions);
    } catch (error: unknown) {
        console.error("Error fetching transactions status:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
