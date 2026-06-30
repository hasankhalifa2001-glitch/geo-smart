"use client";

import { useState, useEffect, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MapsLocation01Icon,
  AngleIcon,
  MapsIcon,
  ArrowRight01Icon,
  LayoutGridIcon,
  Ticket01Icon,
  Book02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const cardHoverTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

const rotatingWords = ["Smart", "Precise", "Instant", "Simple"];
const TYPING_SPEED_MS = 100;
const DELETING_SPEED_MS = 75;
const PAUSE_AFTER_TYPED_MS = 2000;
const PAUSE_AFTER_DELETED_MS = 300;

const gradientTextClass =
  "bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500";

function RotatingTypewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [substring, setSubstring] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];

    if (isTyping) {
      if (substring.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setSubstring(currentWord.slice(0, substring.length + 1));
        }, TYPING_SPEED_MS);
        return () => clearTimeout(timeout);
      }

      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, PAUSE_AFTER_TYPED_MS);
      return () => clearTimeout(timeout);
    }

    if (substring.length > 0) {
      const timeout = setTimeout(() => {
        setSubstring(substring.slice(0, -1));
      }, DELETING_SPEED_MS);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
      setIsTyping(true);
    }, PAUSE_AFTER_DELETED_MS);
    return () => clearTimeout(timeout);
  }, [wordIndex, substring, isTyping]);

  return (
    <span className="inline-flex items-baseline">
      <motion.span className={gradientTextClass}>{substring}</motion.span>
      <motion.span
        className={gradientTextClass}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        |
      </motion.span>
    </span>
  );
}

function ModeSpotlightCard({
  href,
  buttonLabel,
  buttonClassName,
  children,
}: {
  href: string;
  buttonLabel: string;
  buttonClassName: string;
  children: ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.15), transparent 80%)`;

  return (
    <motion.div
      className="group relative flex flex-col justify-between overflow-hidden p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 group-hover:border-emerald-500/30 transition-colors duration-300 shadow-sm hover:shadow-emerald-500/5"
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={cardHoverTransition}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: spotlightBackground }}
      />
      <div className="relative z-10 flex min-h-full flex-1 flex-col justify-between">
        <div>{children}</div>
        <Link href={href} className="mt-6 block">
          <Button className={buttonClassName}>{buttonLabel}</Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-zinc-800/40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="lg" />

          {/* Nav links - Center */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="group flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              <HugeiconsIcon icon={LayoutGridIcon} className="size-4 mr-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              Features
            </Link>
            <Link
              href="#pricing"
              className="group flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              <HugeiconsIcon icon={Ticket01Icon} className="size-4 mr-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              Pricing
            </Link>
            <Link
              href="#docs"
              className="group flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              <HugeiconsIcon icon={Book02Icon} className="size-4 mr-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              Docs
            </Link>
          </nav>

          {/* Nav Actions - Right */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/calculator/map">
              <Button
                variant="ghost"
                size="sm"
                className="border border-emerald-500/30 bg-transparent text-emerald-400 font-medium rounded-xl px-4 py-2 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 cursor-pointer"
              >
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Glow Effects */}
        <div className="relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Hero Section */}
          <section
            className="group/hero max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative isolation-isolate"
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
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                Next-Gen Surveying & Calculations
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
                Real-Estate & Survey Calculations Made <RotatingTypewriter />
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Plot property boundaries, calculate exact areas in localized units, compute custom survey geometries, and export professional reports instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/calculator/map">
                  <Button className="group w-full sm:w-auto px-8 py-6 text-base bg-linear-to-r from-[#00df89] to-[#10b981] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:from-[#00f094] hover:to-[#10c88b] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                    Open Calculator <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
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

          {/* Stats Bar */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md shadow-sm">

              {/* Stat 1 */}
              <div className="text-center p-4 border-r last:border-0 border-slate-200 dark:border-zinc-800/80">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                  3
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Calculation Modes
                </div>
              </div>

              {/* Stat 2 */}
              <div className="text-center p-4 sm:border-r border-slate-200 dark:border-zinc-800/80 last:border-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-500 mb-2 flex items-center justify-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">م²</span>
                  <span className="block border-l h-4 border-slate-300 dark:border-zinc-700" />
                  <span dir="rtl" className="font-sans text-xl sm:text-2xl inline-block text-emerald-600 dark:text-emerald-500 hover:scale-105 transition-transform">دونم</span>
                  <span className="block border-l h-4 border-slate-300 dark:border-zinc-700" />
                  <span dir="rtl" className="font-sans text-xl sm:text-2xl inline-block text-emerald-600 dark:text-emerald-500">هكتار</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Localized Units
                </div>
              </div>

              {/* Stat 3 */}
              <div className="text-center p-4 border-r border-slate-200 dark:border-zinc-800/80 last:border-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                  PDF + DXF
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Professional Export
                </div>
              </div>

              {/* Stat 4 */}
              <div className="text-center p-4 last:border-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  100%
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Offline PWA Ready
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Mode Cards Section */}
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

        {/* Watch Demo Video Mock/Section */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-250/60 dark:border-zinc-800/40 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size="md" />
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} GeoSmart. All rights reserved. Professional Real-Estate Surveying Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
