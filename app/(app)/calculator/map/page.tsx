"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMapStore } from "@/lib/store/useMapStore";
import {
    calculateGeoArea,
    calculateGeoPerimeter,
    isPolygonSelfIntersecting,
} from "@/lib/calculations/geo";
import ResultsSidebar from "@/components/map/ResultsSidebar";
import { cn } from "@/lib/utils";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-zinc-900">
            <p className="text-sm text-slate-500 dark:text-zinc-400">
                Loading map…
            </p>
        </div>
    ),
});

function MapCalculatorContent() {
    const markers = useMapStore((s) => s.markers);
    const setMarkers = useMapStore((s) => s.setMarkers);
    const setResults = useMapStore((s) => s.setResults);

    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const [loadingProject, setLoadingProject] = useState(false);

    // Fetch Project Data on Mount
    useEffect(() => {
        if (!projectId) return;

        async function fetchProject() {
            setLoadingProject(true);
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.coordinates && Array.isArray(data.coordinates)) {
                        setMarkers(data.coordinates);
                    }
                }
            } catch (err) {
                console.error("Error fetching project:", err);
            } finally {
                setLoadingProject(false);
            }
        }

        fetchProject();
    }, [projectId, setMarkers]);

    useEffect(() => {
        if (markers.length < 2) {
            setResults(null, null, false);
            return;
        }

        const perimeter = calculateGeoPerimeter(markers);

        if (markers.length < 3) {
            setResults(null, perimeter, false);
            return;
        }

        const selfIntersecting = isPolygonSelfIntersecting(markers);

        if (selfIntersecting) {
            setResults(null, perimeter, true);
        } else {
            setResults(calculateGeoArea(markers), perimeter, false);
        }
    }, [markers, setResults]);

    const [activeTab, setActiveTab] = useState<"map" | "results">("map");

    return (
        <div className="flex h-[calc(100dvh-4rem)] w-full flex-col sm:flex-row relative ">
            {/* Mobile Tab Switched Navigation */}
            <div className="flex sm:hidden border-b border-slate-200/60 dark:border-zinc-800/40 bg-white dark:bg-[#09090b] sticky top-0 z-20 shrink-0">
                <button
                    onClick={() => setActiveTab("map")}
                    className={cn(
                        "flex-1 py-3 text-sm font-semibold transition-colors border-b-2 text-center outline-none",
                        activeTab === "map"
                            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
                    )}
                >
                    Map View
                </button>
                <button
                    onClick={() => setActiveTab("results")}
                    className={cn(
                        "flex-1 py-3 text-sm font-semibold transition-colors border-b-2 text-center outline-none",
                        activeTab === "results"
                            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
                    )}
                >
                    Results & Coordinates ({markers.length})
                </button>
            </div>

            <div className={cn(
                "relative flex-1 min-h-0",
                activeTab === "map" ? "flex" : "hidden sm:flex"
            )}>
                <LeafletMap />
                {loadingProject && (
                    <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs">
                        <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-xl border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                            <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">Loading project markers...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className={cn(
                "w-full sm:w-auto shrink-0 flex-col sm:flex min-h-0 overflow-y-auto",
                activeTab === "results" ? "flex flex-1" : "hidden"
            )}>
                <ResultsSidebar />
            </div>
        </div>
    );
}

export default function MapCalculatorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-zinc-900">
                <p className="text-sm text-slate-500 dark:text-zinc-400">Loading map calculator...</p>
            </div>
        }>
            <MapCalculatorContent />
        </Suspense>
    );
}
