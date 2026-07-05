"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { RotatingTypewriter } from "./RotatingTypewriter";

export function HeroSection() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const glowSpring = { type: "spring" as const, stiffness: 60, damping: 15, mass: 0.1 };

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    function handleMouseLeave({ currentTarget }: MouseEvent<HTMLElement>) {
        const { width, height } = currentTarget.getBoundingClientRect();
        animate(mouseX, width / 2, glowSpring);
        animate(mouseY, height / 2, glowSpring);
    }

    const glowBackground = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 223, 137, 0.25), rgba(16, 185, 129, 0.1) 40%, transparent 65%)`;

    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <section
                className="group/hero max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center relative isolation-isolate"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Technical grid + ambient glow background */}
                <div className="absolute inset-0 max-w-7xl mx-auto h-[700px] pointer-events-none z-0 isolation-isolate">
                    <div
                        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgb(16, 185, 129) 1px, transparent 1px), linear-gradient(to bottom, rgb(16, 185, 129) 1px, transparent 1px)",
                            backgroundSize: "45px 45px",
                            maskImage:
                                "radial-gradient(circle at center, white 30%, transparent 70%)"
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-0 blur-[130px]"
                        style={{ background: glowBackground }}
                        transition={{ type: "spring", stiffness: 60, damping: 15, mass: 0.1 }}
                    />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xs text-xs font-medium text-slate-600 dark:text-zinc-400 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-50" />
                        Next-Gen Surveying & Calculations
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
                        Real-Estate & Survey Calculations Made <RotatingTypewriter />
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Plot property boundaries, calculate exact areas in localized units, compute custom survey geometries, and export professional reports instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/calculator/map">
                            <Button className="group w-full sm:w-auto px-8 py-6 text-base bg-linear-to-r from-[#00df89] to-[#10b981] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:from-[#00f094] hover:to-[#10c88b] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                                Open Calculator{" "}
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    className="ml-2 size-5 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </Link>
                        <Link href="#demo">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-slate-350 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-2xl transition hover:scale-[1.02] cursor-pointer"
                            >
                                Watch Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
