import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const payload = JSON.parse(bodyText);
        const { transactionId, status, signature } = payload;

        if (!transactionId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const secret = process.env.SHAM_CASH_WEBHOOK_SECRET || "default_sham_secret";

        // Signature validation: token comparison or HMAC
        if (signature) {
            const hmac = createHmac("sha256", secret);
            const computedSignature = hmac.update(transactionId + ":" + status).digest("hex");
            if (signature !== computedSignature) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        } else {
            // If signature parameter is missing but secret exists, we can validate via headers or standard secret query param
            const headerSig = req.headers.get("x-sham-cash-signature");
            if (headerSig && headerSig !== secret) {
                return NextResponse.json({ error: "Invalid secret header" }, { status: 401 });
            }
        }

        // Update transaction status to paid or completed
        const [existing] = await db.select().from(transactions).where(eq(transactions.id, transactionId));
        if (!existing) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        await db.update(transactions)
            .set({
                status: "paid", // or completed
            })
            .where(eq(transactions.id, transactionId));

        return NextResponse.json({ success: true, message: "Webhook processed successfully" });
    } catch (error: unknown) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
