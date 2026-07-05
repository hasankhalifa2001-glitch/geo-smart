"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MapsLocation01Icon, AngleIcon, MapsIcon } from "@hugeicons/core-free-icons";
import { ModeSpotlightCard } from "./ModeSpotlightCard";

export function FeaturesSection() {
    return (
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                    Explore Our Calculation Modes
                </h2>
                <p className="text-slate-600 dark:text-zinc-400">
                    Switch seamlessly between three optimized workflows designed for landowners, surveyors, and real estate professionals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Map Mode */}
                <ModeSpotlightCard
                    href="/calculator/map"
                    buttonLabel="Launch Map Mode"
                    buttonClassName="w-full justify-center bg-slate-900 dark:bg-zinc-800 text-white rounded-xl py-5 cursor-pointer transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500">
                                <HugeiconsIcon icon={MapsLocation01Icon} className="size-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30">
                                Free
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                            Map Mode
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                            Interactive satellite map interface. Plot land boundaries, adjust marker perimeters via drag & drop, and visually capture property areas in real-time.
                        </p>
                        <ul className="space-y-2.5 mb-8 text-xs text-slate-600 dark:text-zinc-400">
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Google Maps Satellite Layer
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Live Elevation Profiling
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Auto-closing Polygonal Areas
                            </li>
                        </ul>
                    </div>
                </ModeSpotlightCard>

                {/* Card 2: Geometric Mode */}
                <ModeSpotlightCard
                    href="/calculator/geometric"
                    buttonLabel="Launch Geometric Mode"
                    buttonClassName="w-full justify-center bg-slate-900 dark:bg-zinc-800 text-white rounded-xl py-5 cursor-pointer transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500">
                                <HugeiconsIcon icon={AngleIcon} className="size-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30">
                                Free
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                            Geometric Mode
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                            Enter physical measurements like side lengths, angles, diagonals, or survey bearings. Get mathematically precise area calculations for custom shapes.
                        </p>
                        <ul className="space-y-2.5 mb-8 text-xs text-slate-600 dark:text-zinc-400">
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Side-Angle-Side Triangulation
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Compass Bearing Entry
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Instant Unit conversion
                            </li>
                        </ul>
                    </div>
                </ModeSpotlightCard>

                {/* Card 3: Professional Mode */}
                <ModeSpotlightCard
                    href="/calculator/professional"
                    buttonLabel="Launch Pro Mode"
                    buttonClassName="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 cursor-pointer transition-colors duration-300"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-650 dark:text-emerald-450 border border-emerald-500/10">
                                <HugeiconsIcon icon={MapsIcon} className="size-6 text-emerald-550" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-250/20 animate-pulse">
                                Pro
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                            Professional Mode
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                            Advanced toolkit for land partitions, complex cadastral layouts, CAD-grade DXF exports, custom scaling, and secure client sharing hubs.
                        </p>
                        <ul className="space-y-2.5 mb-8 text-xs text-slate-600 dark:text-zinc-400">
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                DXF / CAD Vector Export
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Subdivision / Partition Algorithms
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Shareable Client Reports
                            </li>
                        </ul>
                    </div>
                </ModeSpotlightCard>
            </div>
        </section>
    );
}
