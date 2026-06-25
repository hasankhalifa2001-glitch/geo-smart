import React from "react";
import Link from "next/link";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
            <header className="px-6 h-16 flex items-center border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 justify-between">
                <Link className="flex items-center gap-2 font-bold text-lg" href="/">
                    <span className="text-emerald-600">GeoSmart Dashboard</span>
                </Link>
                <nav className="flex gap-4">
                    <Link href="/dashboard" className="text-sm font-medium hover:underline">
                        Dashboard
                    </Link>
                    <Link href="/calculator/map" className="text-sm font-medium hover:underline">
                        Map
                    </Link>
                    <Link href="/calculator/geometric" className="text-sm font-medium hover:underline">
                        Geometric
                    </Link>
                    <Link href="/calculator/professional" className="text-sm font-medium hover:underline">
                        Professional
                    </Link>
                </nav>
            </header>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
