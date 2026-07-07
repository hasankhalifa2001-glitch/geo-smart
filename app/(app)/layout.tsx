"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MapsLocation01Icon,
  AngleIcon,
  MapsIcon,
  DashboardSpeedIcon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    name: "Map",
    href: "/calculator/map",
    icon: MapsLocation01Icon,
  },
  {
    name: "Geometric",
    href: "/calculator/geometric",
    icon: AngleIcon,
  },
  {
    name: "Professional",
    href: "/calculator/professional",
    icon: MapsIcon,
  },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-[1030] w-full h-16 border-b border-slate-200/60 dark:border-zinc-800/40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">

        {/* Left: Logo & Dashboard home */}
        <div className="flex items-center gap-4">
          <Logo size="md" href="/" />

          <span className="hidden md:inline-block border-l h-4 border-slate-300 dark:border-zinc-700" />

          <Link
            href="/dashboard"
            className={cn(
              "hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-emerald-500",
              pathname === "/dashboard"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-zinc-400"
            )}
          >
            <HugeiconsIcon icon={DashboardSpeedIcon} className="size-4" />
            Dashboard
          </Link>
        </div>

        {/* Center: Mode Switching Tabs */}
        <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200/50 dark:border-zinc-800/40">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer",
                  isActive
                    ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                )}
              >
                <HugeiconsIcon icon={tab.icon} className="size-3.5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Theme & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <ProfileDropdown />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <HugeiconsIcon
              icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon}
              className="size-5 transition-transform duration-200"
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-[1010] bg-slate-950/20 dark:bg-black/40 backdrop-blur-xs md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-x-0 top-16 z-[1020] bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800/80 shadow-lg md:hidden p-4 flex flex-col gap-2"
            >
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                    pathname === "/dashboard"
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                  )}
                >
                  <HugeiconsIcon icon={DashboardSpeedIcon} className="size-5" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-px bg-slate-100 dark:bg-zinc-800/60 my-1" />

                <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 px-4 uppercase tracking-wider mb-1">
                  Calculators
                </div>

                {tabs.map((tab) => {
                  const isActive = pathname === tab.href;
                  return (
                    <Link
                      key={tab.name}
                      href={tab.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                      )}
                    >
                      <HugeiconsIcon icon={tab.icon} className="size-5" />
                      <span>{tab.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Container wrapping dynamic content */}
      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>
    </div>
  );
}
