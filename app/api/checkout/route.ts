import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { transactions, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { projectId, productType } = body; // 'pdf' | 'dxf'

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        // Verify project exists
        const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const transactionId = crypto.randomUUID();
        const gatewayOrderId = "SHAM-" + Math.floor(100000 + Math.random() * 900000);

        // Price is say 15,000 SYP for PDF/DXF exports
        const amount = 15000;
        const currency = "SYP";

        // Insert pending transaction
        await db.insert(transactions).values({
            id: transactionId,
            userId,
            projectId,
            amount,
            currency,
            status: "pending",
            gatewayOrderId,
        });

        // Register with Sham Cash / Cash Mobile (mocking the API register response)
        // In reality: const res = await fetch("https://api.shamcash.sy/v1/checkout", { ... })
        // For local development and demonstration, redirect to our mock gateway page
        const redirectUrl = `/checkout-mock?transactionId=${transactionId}&amount=${amount}&orderId=${gatewayOrderId}`;

        return NextResponse.json({
            success: true,
            redirectUrl,
            transactionId,
        });
    } catch (error: unknown) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
