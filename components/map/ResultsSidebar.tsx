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

    const displayArea =
        areaM2 !== null && !isSelfIntersecting
            ? convertArea(areaM2, unitPreference)
            : null;

    const activeUnitLabel =
        UNITS.find((u) => u.key === unitPreference)?.label ?? "m²";

    return (
        <aside className="flex w-full shrink-0 flex-col border-l border-slate-200/60 bg-white dark:border-zinc-800/40 dark:bg-[#09090b] sm:w-80 lg:w-96">
            <Card className="h-full rounded-none border-0 shadow-none ring-0">
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
