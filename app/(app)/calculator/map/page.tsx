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

    return (
        <div className="flex flex-1 min-h-0 w-full flex-col sm:flex-row">
            <div className="relative min-h-[50vh] flex-1 sm:min-h-0">
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
            <ResultsSidebar />
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
