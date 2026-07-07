"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    MapsLocation01Icon,
    AngleIcon,
    MapsIcon,
    Download01Icon,
    Delete02Icon,
    CreditCardIcon,
    Search01Icon,
    LoadingIcon,
} from "@hugeicons/core-free-icons";
import { convertArea, UnitType } from "@/lib/utils/units";
import { motion } from "framer-motion";

interface Project {
    id: string;
    userId: string;
    name: string;
    mode: string;
    coordinates: [number, number][] | null;
    areaM2: number | null;
    perimeterM: number | null;
    unitPreference: string;
    createdAt: string;
}

interface Transaction {
    id: string;
    projectId: string | null;
    status: string;
}

interface DashboardProjectListProps {
    initialProjects: Project[];
    initialTransactions: Transaction[];
}

export default function DashboardProjectList({
    initialProjects,
    initialTransactions,
}: DashboardProjectListProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Filter projects by search query
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if a project has a paid/completed transaction
    const isPaid = (projectId: string) => {
        return transactions.some(
            (t) => t.projectId === projectId && (t.status === "paid" || t.status === "completed")
        );
    };

    // Check if a project has a pending transaction
    const isPending = (projectId: string) => {
        return transactions.some(
            (t) => t.projectId === projectId && t.status === "pending"
        );
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdownId(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Poll for status of pending transactions
    useEffect(() => {
        const pendingProjects = projects.filter((p) => isPending(p.id));
        if (pendingProjects.length === 0) return;

        const interval = setInterval(async () => {
            try {
                // Fetch transactions to see if status updated
                const res = await fetch("/api/projects/transactions-status");
                if (res.ok) {
                    const latestTransactions = await res.json();
                    setTransactions(latestTransactions);
                }
            } catch (err) {
                console.error("Error polling transactions status:", err);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [projects, transactions]);

    // Handle delete project
    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setLoadingProjectId(projectId);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== projectId));
            } else {
                alert("Failed to delete project");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting project");
        } finally {
            setLoadingProjectId(null);
        }
    };

    // Handle payment checkout
    const handleCheckout = async (projectId: string) => {
        setLoadingProjectId(projectId);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, productType: "premium" }),
            });

            const data = await res.json();
            if (res.ok && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert(data.error || "Failed to initiate payment checkout");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while initiating checkout");
        } finally {
            setLoadingProjectId(null);
        }
    };

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case "map":
                return MapsLocation01Icon;
            case "geometric":
                return AngleIcon;
            case "professional":
            default:
                return MapsIcon;
        }
    };

    const getModeBadgeClass = (mode: string) => {
        switch (mode) {
            case "map":
                return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            case "geometric":
                return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
            case "professional":
            default:
                return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Action Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <HugeiconsIcon icon={Search01Icon} className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-800 rounded-xl bg-zinc-900/60 backdrop-blur-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-zinc-100 placeholder-zinc-500 transition-all duration-300"
                    />
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
                    <p className="text-zinc-400 mb-4">No projects found.</p>
                    <Link
                        href="/calculator/map"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition"
                    >
                        Create Your First Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {filteredProjects.map((project) => {
                        const paid = isPaid(project.id);
                        const pending = isPending(project.id);
                        const unit = (project.unitPreference || "m2") as UnitType;
                        const convertedArea = project.areaM2 ? convertArea(project.areaM2, unit) : 0;
                        const ModeIcon = getModeIcon(project.mode);

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2, scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className={`relative flex flex-col bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-emerald-500/30 transition-all duration-300 p-5 ${openDropdownId === project.id ? "z-30" : "z-10"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-zinc-100 line-clamp-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Created: {new Date(project.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex items-center gap-1.5 ${getModeBadgeClass(project.mode)}`}>
                                        <HugeiconsIcon icon={ModeIcon} className="size-3.5" />
                                        {project.mode}
                                    </span>
                                </div>

                                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Area:</span>
                                        <span className="font-semibold text-zinc-200">
                                            {convertedArea.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unit === "m2" ? "m²" : unit.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Perimeter:</span>
                                        <span className="font-semibold text-zinc-200">
                                            {project.perimeterM ? `${project.perimeterM.toLocaleString(undefined, { maximumFractionDigits: 2 })} m` : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Points:</span>
                                        <span className="font-semibold text-zinc-200">
                                            {project.coordinates?.length || 0} vertices
                                        </span>
                                    </div>
                                </div>

                                {/* Actions Row */}
                                <div className="mt-auto pt-4 border-t border-zinc-800/60 flex flex-wrap gap-2 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/calculator/${project.mode}?id=${project.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/60 text-zinc-300 text-xs font-semibold rounded-lg transition"
                                        >
                                            <HugeiconsIcon icon={MapsLocation01Icon} className="size-3.5 text-zinc-400" />
                                            Open
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            disabled={loadingProjectId === project.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                                        >
                                            <HugeiconsIcon icon={loadingProjectId === project.id ? LoadingIcon : Delete02Icon} className={`size-3.5 ${loadingProjectId === project.id ? "animate-spin text-zinc-400" : "text-zinc-500"}`} />
                                            Delete
                                        </button>
                                    </div>

                                    <div>
                                        {paid ? (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation(); // Crucial to prevent global document listener from firing instantly
                                                        setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                                                    <span>Export Files</span>
                                                    <svg className={`size-3 transition-transform ${openDropdownId === project.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                {openDropdownId === project.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl py-1.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-1 duration-150 ">
                                                        <a
                                                            href={`/api/reports/${project.id}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-emerald-500/10 transition-colors"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            <svg className="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            Download PDF Report
                                                        </a>
                                                        <a
                                                            href={`/api/export/dxf?projectId=${project.id}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-emerald-500/10 transition-colors"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            <svg className="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                            </svg>
                                                            Export DXF CAD
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : pending ? (
                                            <button
                                                disabled
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold rounded-lg"
                                            >
                                                <HugeiconsIcon icon={LoadingIcon} className="size-3.5 animate-spin" />
                                                Polling Payment...
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout(project.id)}
                                                disabled={loadingProjectId !== null}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer shadow-xs"
                                            >
                                                <HugeiconsIcon icon={CreditCardIcon} className="size-3.5" />
                                                Unlock Premium (15k SYP)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}