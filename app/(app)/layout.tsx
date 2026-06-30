"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MapsLocation01Icon,
  AngleIcon,
  MapsIcon,
  DashboardSpeedIcon,
  UserCircleIcon
} from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200/60 dark:border-zinc-800/40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">

        {/* Left: Logo & Dashboard home */}
        <div className="flex items-center gap-4">
          <Logo size="md" href="/" />

          <span className="hidden sm:inline-block border-l h-4 border-slate-300 dark:border-zinc-700" />

          <Link
            href="/dashboard"
            className={cn(
              "hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:text-emerald-500",
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
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200/50 dark:border-zinc-800/40">
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
        <div className="flex items-center gap-3">
          {/* Mobile dashboard link */}
          <Link
            href="/dashboard"
            className={cn(
              "sm:hidden p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900",
              pathname === "/dashboard"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-zinc-400"
            )}
            title="Dashboard"
          >
            <HugeiconsIcon icon={DashboardSpeedIcon} className="size-5" />
          </Link>

          <ThemeToggle />

          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center border border-slate-350 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition">
              <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-slate-550 dark:text-zinc-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container wrapping dynamic content */}
      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>
    </div>
  );
}
