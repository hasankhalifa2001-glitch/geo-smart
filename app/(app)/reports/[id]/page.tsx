import React from "react";

interface ReportPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
    const { id } = await params;
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Report: {id}</h1>
            <p className="text-slate-600 dark:text-zinc-400">
                This is a placeholder page for viewing and exporting report details for project ID {id}.
            </p>
        </div>
    );
}
