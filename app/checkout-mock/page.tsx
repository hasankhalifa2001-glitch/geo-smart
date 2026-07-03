import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{
        transactionId?: string;
        amount?: string;
        orderId?: string;
    }>;
}

export default async function CheckoutMockPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const transactionId = params.transactionId || "";
    const amount = params.amount || "15000";
    const orderId = params.orderId || "";

    async function approvePayment() {
        "use server";

        if (!transactionId) {
            return;
        }

        // Update transaction status to paid
        await db.update(transactions)
            .set({ status: "paid" })
            .where(eq(transactions.id, transactionId));

        redirect("/dashboard?payment_success=true");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-100">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                <div className="text-center space-y-2 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-500 font-sans">Sham Cash / Cash Mobile</h1>
                    <p className="text-sm text-zinc-400">Simulated Syrian Mobile Payment Gateway</p>
                </div>

                <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Order ID:</span>
                        <span className="font-mono text-zinc-200">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Transaction ID:</span>
                        <span className="font-mono text-zinc-300 text-xs truncate max-w-[200px]" title={transactionId}>
                            {transactionId}
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-zinc-800 pt-3">
                        <span className="text-zinc-300">Total Amount:</span>
                        <span className="text-emerald-400">{Number(amount).toLocaleString()} SYP</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <form action={approvePayment}>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors py-3 text-sm font-semibold text-white shadow-lg cursor-pointer"
                        >
                            Approve & Authorize Payment
                        </button>
                    </form>

                    <Link
                        href="/dashboard"
                        className="block w-full text-center rounded-lg border border-zinc-800 hover:bg-zinc-800 py-3 text-sm font-semibold text-zinc-400 transition-colors"
                    >
                        Cancel Transaction
                    </Link>
                </div>

                <div className="mt-6 text-center text-xs text-zinc-500">
                    This is a secure development simulation page for testing Premium Exports.
                </div>
            </div>
        </div>
    );
}
