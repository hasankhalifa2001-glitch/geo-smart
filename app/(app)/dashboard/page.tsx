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
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800/60 pb-5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 font-sans">
                        Saved Projects
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Manage, view, and export your professional survey calculations and maps.
                    </p>
                </div>
            </div>

            <DashboardProjectList
                initialProjects={serializedProjects}
                initialTransactions={userTransactions}
            />
        </div>
    );
}
