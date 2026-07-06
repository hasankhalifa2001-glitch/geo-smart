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

    const [activeMobileTab, setActiveMobileTab] = useState<"map" | "results">("map");

    return (
        <div className="flex flex-1 min-h-0 w-full flex-col sm:flex-row h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] overflow-hidden relative">
            {/* Map View */}
            <div className={`relative flex-1 sm:min-h-0 ${activeMobileTab === "map" ? "flex h-full flex-col" : "hidden sm:flex sm:h-full sm:flex-col"}`}>
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

            {/* Sidebar View */}
            <div className={`h-full ${activeMobileTab === "results" ? "flex flex-1 flex-col" : "hidden sm:flex"}`}>
                <ResultsSidebar />
            </div>

            {/* Mobile Navigation Bar - Fixed at bottom */}
            <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-1 rounded-full bg-zinc-950/90 dark:bg-zinc-900/95 p-1 border border-zinc-800 backdrop-blur-md shadow-xl">
                <button
                    type="button"
                    onClick={() => setActiveMobileTab("map")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${activeMobileTab === "map"
                        ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                        <line x1="8" y1="2" x2="8" y2="18" />
                        <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                    Map View
                </button>
                <button
                    type="button"
                    onClick={() => setActiveMobileTab("results")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${activeMobileTab === "results"
                        ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Results {markers.length > 0 && `(${markers.length})`}
                </button>
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
