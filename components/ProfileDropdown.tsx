"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserCircleIcon,
    ArrowDown01Icon,
    Logout01Icon,
} from "@hugeicons/core-free-icons";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function ProfileDropdown() {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center border border-slate-350 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500/50 transition">
                    {session?.user?.name ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {session.user.name[0].toUpperCase()}
                        </span>
                    ) : (
                        <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-slate-550 dark:text-zinc-400" />
                    )}
                </div>
                <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className={cn(
                        "hidden md:block size-3.5 text-slate-500 transition-transform duration-200",
                        dropdownOpen && "rotate-180"
                    )}
                />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-xl z-50">
                    <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
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
    );
}
