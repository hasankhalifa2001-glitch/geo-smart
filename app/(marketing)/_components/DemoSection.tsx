export function DemoSection() {
    return (
        <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
                        Watch GeoSmart in Action
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed">
                        See how easily you can customize, measure, and share survey outputs in less than 2 minutes.
                    </p>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-850 bg-slate-950 flex items-center justify-center shadow-lg group">
                        {/* Glow layer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="p-5 rounded-full bg-emerald-600 text-white cursor-pointer hover:scale-110 active:scale-95 transition shadow-lg shadow-emerald-600/30">
                                <svg className="size-8 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
                                Interactive Walkthrough Preview
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
