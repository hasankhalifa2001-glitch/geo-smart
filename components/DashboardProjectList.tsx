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
    Tick01Icon,
} from "@hugeicons/core-free-icons";
import { convertArea, UnitType } from "@/lib/utils/units";

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
                return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30";
            case "geometric":
                return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30";
            case "professional":
            default:
                return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Action Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <HugeiconsIcon icon={Search01Icon} className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-zinc-100"
                    />
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                    <p className="text-slate-500 dark:text-zinc-400 mb-4">No projects found.</p>
                    <Link
                        href="/calculator/map"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition"
                    >
                        Create Your First Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map((project) => {
                        const paid = isPaid(project.id);
                        const pending = isPending(project.id);
                        const unit = (project.unitPreference || "m2") as UnitType;
                        const convertedArea = project.areaM2 ? convertArea(project.areaM2, unit) : 0;
                        const ModeIcon = getModeIcon(project.mode);

                        return (
                            <div
                                key={project.id}
                                className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800/40 shadow-xs hover:shadow-md transition duration-300 p-5"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-900 dark:text-zinc-100 line-clamp-1">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                                            Created: {new Date(project.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex items-center gap-1.5 ${getModeBadgeClass(project.mode)}`}>
                                        <HugeiconsIcon icon={ModeIcon} className="size-3.5" />
                                        {project.mode}
                                    </span>
                                </div>

                                <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-xl p-3 space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Area:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            {convertedArea.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unit === "m2" ? "m²" : unit.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Perimeter:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            {project.perimeterM ? `${project.perimeterM.toLocaleString(undefined, { maximumFractionDigits: 2 })} m` : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Points:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            {project.coordinates?.length || 0} vertices
                                        </span>
                                    </div>
                                </div>

                                {/* Actions Row */}
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex flex-wrap gap-2 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/calculator/${project.mode}?id=${project.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold rounded-lg transition"
                                        >
                                            <HugeiconsIcon icon={MapsLocation01Icon} className="size-3.5" />
                                            Open
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            disabled={loadingProjectId === project.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                                        >
                                            <HugeiconsIcon icon={loadingProjectId === project.id ? LoadingIcon : Delete02Icon} className={`size-3.5 ${loadingProjectId === project.id ? "animate-spin" : ""}`} />
                                            Delete
                                        </button>
                                    </div>

                                    <div>
                                        {paid ? (
                                            <div className="flex items-center gap-1.5">
                                                <a
                                                    href={`/api/reports/${project.id}`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                                                    title="Download PDF Survey Report"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                                                    PDF Report
                                                </a>
                                                <a
                                                    href={`/api/export/dxf?projectId=${project.id}`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
                                                    title="Export to CAD DXF"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                                                    DXF CAD
                                                </a>
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
