export function StatsBar() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12 sm:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md shadow-sm">
                {/* Stat 1 */}
                <div className="text-center p-4 border-b sm:border-r lg:border-b-0 border-slate-200 dark:border-zinc-800/80">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                        3
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                        Calculation Modes
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="text-center p-4 border-b lg:border-r lg:border-b-0 border-slate-200 dark:border-zinc-800/80">
                    <div className="text-2xl min-[360px]:text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-500 mb-2 flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">م²</span>
                        <span className="block border-l h-4 border-slate-300 dark:border-zinc-700" />
                        <span
                            dir="rtl"
                            className="font-sans text-lg min-[360px]:text-xl sm:text-2xl inline-block text-emerald-600 dark:text-emerald-500 hover:scale-105 transition-transform"
                        >
                            دونم
                        </span>
                        <span className="block border-l h-4 border-slate-300 dark:border-zinc-700" />
                        <span dir="rtl" className="font-sans text-lg min-[360px]:text-xl sm:text-2xl inline-block text-emerald-600 dark:text-emerald-500">
                            هكتار
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                        Localized Units
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="text-center p-4 border-b sm:border-r sm:border-b-0 border-slate-200 dark:border-zinc-800/80">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                        PDF + DXF
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                        Professional Export
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="text-center p-4">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                        100%
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                        Offline PWA Ready
                    </div>
                </div>
            </div>
        </section>
    );
}
