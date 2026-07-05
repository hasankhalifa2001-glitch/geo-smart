"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    LayoutGridIcon,
    Ticket01Icon,
    Book02Icon,
    UserCircleIcon,
    ArrowDown01Icon,
    Logout01Icon,
    Menu01Icon,
    Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
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
                <div className="flex items-center gap-1.5 sm:gap-4">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <div className="flex items-center gap-1.5 sm:gap-4">
                            <Link href="/calculator/map">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border border-emerald-500/30 bg-transparent text-emerald-400 font-medium rounded-xl px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 cursor-pointer"
                                >
                                    <span className="hidden min-[420px]:inline">Go to Calculator</span>
                                    <span className="min-[420px]:hidden">Calc</span>
                                </Button>
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-1 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-850 flex items-center justify-center border border-slate-350 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition">
                                        {session?.user?.name ? (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                {session.user.name[0].toUpperCase()}
                                            </span>
                                        ) : (
                                            <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-slate-550 dark:text-zinc-400" />
                                        )}
                                    </div>
                                    <HugeiconsIcon icon={ArrowDown01Icon} className={cn("hidden md:block size-3.5 text-slate-500 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/95 backdrop-blur-md p-1.5 shadow-xl z-50">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <HugeiconsIcon icon={UserCircleIcon} className="size-4 text-slate-500" />
                                            <span>Profile</span>
                                        </Link>
                                        <div className="border-t border-slate-200 dark:border-zinc-800 my-1" />
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left"
                                        >
                                            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                href="/login"
                                className="text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Log In
                            </Link>
                            <Link href="/calculator/map">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border border-emerald-500/30 bg-transparent text-emerald-400 font-medium rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 cursor-pointer"
                                >
                                    <span className="hidden min-[420px]:inline">Start Free</span>
                                    <span className="min-[420px]:hidden">Calc</span>
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900/50 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} className="size-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute top-16 left-0 w-full md:hidden border-b border-slate-200/60 dark:border-zinc-800/40 bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-md shadow-xl overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            <Link
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                            >
                                <HugeiconsIcon icon={LayoutGridIcon} className="size-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                                Features
                            </Link>
                            <Link
                                href="#pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                            >
                                <HugeiconsIcon icon={Ticket01Icon} className="size-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                                Pricing
                            </Link>
                            <Link
                                href="#docs"
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                            >
                                <HugeiconsIcon icon={Book02Icon} className="size-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                                Docs
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
