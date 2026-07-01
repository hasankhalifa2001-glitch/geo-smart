"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
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

export default function MapCalculatorPage() {
    const markers = useMapStore((s) => s.markers);
    const setResults = useMapStore((s) => s.setResults);

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
            </div>
            <ResultsSidebar />
        </div>
    );
}
