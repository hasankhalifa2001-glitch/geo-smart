import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, transactions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import DashboardProjectList from "@/components/DashboardProjectList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const userId = (session.user as { id: string }).id;
    if (!userId) {
        redirect("/login");
    }

    // Fetch projects for user, sorted by descending createdAt
    const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.createdAt));

    // Fetch transactions for user to determine paid status
    const userTransactions = await db
        .select({
            id: transactions.id,
            projectId: transactions.projectId,
            status: transactions.status,
        })
        .from(transactions)
        .where(eq(transactions.userId, userId));

    // Convert Date objects to ISO string format for safe client-side consumption
    const serializedProjects = userProjects.map((proj) => ({
        ...proj,
        createdAt: proj.createdAt.toISOString(),
    }));

    return (
        <div className="flex-1 w-full bg-zinc-950 text-zinc-50 relative overflow-hidden py-8">
            {/* TECHNICAL GRID & RADIAL BACKGROUND */}
            {/* Fine Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
            />
            {/* Major Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:160px_160px] pointer-events-none"
            />

            {/* Soft Emerald Radial Gradients for corner/edge glow & depth */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-50 font-sans flex items-center gap-2">
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Saved Projects</span>
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Manage, view, and export your professional survey calculations and maps.
                        </p>
                    </div>
                </div>

                <DashboardProjectList
                    initialProjects={serializedProjects}
                    initialTransactions={userTransactions}
                />
            </div>
        </div>
    );
}