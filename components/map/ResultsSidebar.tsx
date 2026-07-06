"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Cancel01Icon,
    Download01Icon,
    FileExportIcon,
    Delete02Icon,
} from "@hugeicons/core-free-icons";
import { useMapStore, type UnitType } from "@/lib/store/useMapStore";
import { convertArea } from "@/lib/utils/units";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Tick01Icon } from "@hugeicons/core-free-icons";

const UNITS: { key: UnitType; label: string }[] = [
    { key: "m2", label: "m²" },
    { key: "donum", label: "دونم" },
    { key: "hectare", label: "هكتار" },
    { key: "qasaba", label: "قصبة" },
];

function formatNumber(value: number, decimals = 2): string {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

async function handlePremiumAction(action: "pdf" | "dxf") {
    const endpoint =
        action === "pdf" ? "/api/checkout" : "/api/export/dxf";
    await fetch(endpoint, { method: "POST" });
}

export default function ResultsSidebar() {
    const markers = useMapStore((s) => s.markers);
    const areaM2 = useMapStore((s) => s.areaM2);
    const perimeterM = useMapStore((s) => s.perimeterM);
    const isSelfIntersecting = useMapStore((s) => s.isSelfIntersecting);
    const unitPreference = useMapStore((s) => s.unitPreference);
    const setUnit = useMapStore((s) => s.setUnit);
    const removeMarker = useMapStore((s) => s.removeMarker);
    const clearMarkers = useMapStore((s) => s.clearMarkers);
    const addMarker = useMapStore((s) => s.addMarker);

    const pathname = usePathname();
    const [saving, setSaving] = useState(false);

    // Manual coordinates state
    const [latInput, setLatInput] = useState("");
    const [lngInput, setLngInput] = useState("");
    const [coordError, setCoordError] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setCoordError("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);
        setCoordError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                addMarker([latitude, longitude]);
                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);
                let message = "Unable to retrieve your location.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission denied. Please enable location services in your browser/device settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "Location request timed out. Please try again.";
                        break;
                }
                setCoordError(message);
                alert(message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleAddManualPoint = (e: React.FormEvent) => {
        e.preventDefault();
        setCoordError(null);

        const latVal = latInput.trim();
        const lngVal = lngInput.trim();

        if (!latVal || !lngVal) {
            setCoordError("Please enter both latitude and longitude.");
            return;
        }

        const lat = parseFloat(latVal);
        const lng = parseFloat(lngVal);

        if (isNaN(lat) || lat < -90 || lat > 90) {
            setCoordError("Latitude must be a valid number between -90 and 90.");
            return;
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            setCoordError("Longitude must be a valid number between -180 and 180.");
            return;
        }

        addMarker([lat, lng]);
        setLatInput("");
        setLngInput("");
    };

    const displayArea =
        areaM2 !== null && !isSelfIntersecting
            ? convertArea(areaM2, unitPreference)
            : null;

    const activeUnitLabel =
        UNITS.find((u) => u.key === unitPreference)?.label ?? "m²";

    const handleSaveProject = async () => {
        const name = prompt("Enter a name for your project:");
        if (!name) return;

        let mode = "map";
        if (pathname.includes("geometric")) mode = "geometric";
        else if (pathname.includes("professional")) mode = "professional";

        setSaving(true);
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    mode,
                    coordinates: markers,
                    areaM2,
                    perimeterM,
                    unitPreference,
                }),
            });

            if (res.ok) {
                alert("Project saved successfully!");
            } else {
                const errData = await res.json();
                alert(`Failed to save project: ${errData.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving project.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <aside className="flex h-full w-full shrink-0 flex-col border-l border-slate-200/60 bg-white dark:border-zinc-800/40 dark:bg-[#09090b] sm:w-80 lg:w-96">
            <Card className="h-full flex flex-col rounded-none border-0 shadow-none ring-0">
                <CardHeader className="border-b border-slate-200/60 dark:border-zinc-800/40">
                    <CardTitle className="text-lg font-bold">
                        Results
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6 overflow-y-auto pt-6">
                    {/* Area */}
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            Area
                        </p>
                        {displayArea !== null ? (
                            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatNumber(displayArea)}{" "}
                                <span className="text-2xl">{activeUnitLabel}</span>
                            </p>
                        ) : isSelfIntersecting ? (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                Invalid boundary — adjust markers
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 dark:text-zinc-500">
                                Place 3+ points to calculate area
                            </p>
                        )}
                    </div>

                    {/* Perimeter */}
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            Perimeter
                        </p>
                        {perimeterM !== null ? (
                            <p className="text-xl font-semibold text-slate-800 dark:text-zinc-200">
                                {formatNumber(perimeterM)} m
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 dark:text-zinc-500">
                                Place 2+ points to calculate perimeter
                            </p>
                        )}
                    </div>

                    {/* Unit selector */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            Unit
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                            {UNITS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setUnit(key)}
                                    className={cn(
                                        "rounded-xl border px-2 py-2 text-xs font-medium transition-colors",
                                        unitPreference === key
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Point Manually */}
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            Add Point Manually
                        </p>
                        <form onSubmit={handleAddManualPoint} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                        Latitude
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 35.392938"
                                        value={latInput}
                                        onChange={(e) => setLatInput(e.target.value)}
                                        className="h-9 px-3 text-xs bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                        Longitude
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 35.920186"
                                        value={lngInput}
                                        onChange={(e) => setLngInput(e.target.value)}
                                        className="h-9 px-3 text-xs bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                            {coordError && (
                                <p className="text-xs text-red-500 dark:text-red-400">
                                    {coordError}
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="h-9 w-full justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="currentColor" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Add Point
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                disabled={loadingLocation}
                                variant="outline"
                                className="h-9 w-full justify-center gap-1.5 border-emerald-500/30 hover:border-emerald-500 bg-transparent hover:bg-emerald-50/5 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={cn("shrink-0", loadingLocation && "animate-spin")}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="3" />
                                    <line x1="12" y1="1" x2="12" y2="4" />
                                    <line x1="12" y1="20" x2="12" y2="23" />
                                    <line x1="1" y1="12" x2="4" y2="12" />
                                    <line x1="20" y1="12" x2="23" y2="12" />
                                </svg>
                                {loadingLocation ? "Fetching Location..." : "Use My Current Location"}
                            </Button>
                        </form>
                    </div>

                    {/* Coordinate list */}
                    <div className="flex min-h-0 flex-1 flex-col">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                            Coordinates ({markers.length})
                        </p>
                        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                            {markers.length === 0 ? (
                                <p className="p-4 text-center text-sm text-slate-400 dark:text-zinc-500">
                                    Click the map to add points
                                </p>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {markers.map(([lat, lng], index) => (
                                        <li
                                            key={`coord-${index}`}
                                            className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                                        >
                                            <div className="min-w-0">
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    P{index + 1}
                                                </span>
                                                <span className="ml-2 font-mono text-xs text-slate-600 dark:text-zinc-400">
                                                    {lat.toFixed(6)},{" "}
                                                    {lng.toFixed(6)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeMarker(index)
                                                }
                                                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                title={`Remove P${index + 1}`}
                                            >
                                                <HugeiconsIcon
                                                    icon={Cancel01Icon}
                                                    className="size-4"
                                                />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            onClick={handleSaveProject}
                            disabled={markers.length === 0 || saving}
                            className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        >
                            <HugeiconsIcon icon={Tick01Icon} className="size-4" />
                            {saving ? "Saving..." : "Save Project"}
                        </Button>

                        <Button
                            variant="outline"
                            className="relative w-full justify-start gap-2 opacity-75"
                            onClick={() => handlePremiumAction("pdf")}
                        >
                            <HugeiconsIcon
                                icon={Download01Icon}
                                className="size-4"
                            />
                            Download PDF Report
                            <span className="ml-auto rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                                Pro
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            className="relative w-full justify-start gap-2 opacity-75"
                            onClick={() => handlePremiumAction("dxf")}
                        >
                            <HugeiconsIcon
                                icon={FileExportIcon}
                                className="size-4"
                            />
                            Export DXF
                            <span className="ml-auto rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                                Pro
                            </span>
                        </Button>

                        <Button
                            variant="destructive"
                            className="w-full justify-start gap-2"
                            onClick={clearMarkers}
                            disabled={markers.length === 0}
                        >
                            <HugeiconsIcon
                                icon={Delete02Icon}
                                className="size-4"
                            />
                            Clear All Points
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}
