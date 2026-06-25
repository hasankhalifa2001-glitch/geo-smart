import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <Link className="flex items-center justify-center gap-2 font-bold text-xl" href="/">
                    <span className="text-emerald-600">GeoSmart</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
                        Dashboard
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/calculator/map">
                        Map Calculator
                    </Link>
                </nav>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
                    Real-Estate & Survey Calculations Made <span className="text-emerald-600">Smart</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mb-8">
                    Plot properties, calculate exact areas in local units (Donum, Qasaba), compute custom survey geometries, and generate professional PDF reports.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                        Go to Dashboard
                    </Link>
                    <Link href="/calculator/map" className="px-6 py-3 rounded-lg border border-slate-300 dark:border-zinc-700 font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
                        Try Map Calculator
                    </Link>
                </div>
            </main>
        </div>
    );
}
