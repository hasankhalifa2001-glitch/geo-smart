"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
    calculateGeometricArea,
    calculateGeometricPerimeter,
    reconstructGeometricVertices,
    isPolygonUnclosable
} from "@/lib/calculations/geometric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convertArea, UnitType } from "@/lib/utils/units";

// Validation schema using Zod
const geometricFormSchema = z.object({
    rows: z.array(
        z.object({
            length: z.coerce.number().positive("Side length must be positive"),
            angle: z.coerce.number().min(0, "Angle must be >= 0").max(360, "Angle must be <= 360"),
        })
    ).min(3, "At least 3 sides are required"),
});

type GeometricFormValues = z.infer<typeof geometricFormSchema>;

export default function GeometricCalculatorPage() {
    const [calculatedResults, setCalculatedResults] = useState<{
        areaM2: number;
        perimeter: number;
        vertices: [number, number][];
        isUnclosable?: boolean;
    } | null>(null);

    const [unitPreference, setUnitPreference] = useState<UnitType>("m2");

    // Initialize with standard 4-sided shape (10x10 square)
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<GeometricFormValues>({
        resolver: undefined, // Let's perform validation manually or via zod schema validation inside onSubmit / onSubmit-helper for exact feedback and custom angle-sum inline validation
        defaultValues: {
            rows: [
                { length: 10, angle: 90 },
                { length: 10, angle: 90 },
                { length: 10, angle: 90 },
                { length: 10, angle: 90 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
    });

    const watchedRows = watch("rows") || [];
    const n = watchedRows.length;
    const expectedAngleSum = (n - 2) * 180;
    const currentAngleSum = watchedRows.reduce((sum, r) => sum + (Number(r.angle) || 0), 0);
    const isAngleSumValid = Math.abs(currentAngleSum - expectedAngleSum) < 0.1;

    // Handle Form Submission
    const handleCalculate = (data: GeometricFormValues) => {
        // Double check validation before processing
        const lengths = data.rows.map(r => r.length);
        const angles = data.rows.map(r => r.angle);

        const area = calculateGeometricArea(lengths, angles);
        const perimeter = calculateGeometricPerimeter(lengths);
        const vertices = reconstructGeometricVertices(lengths, angles);
        const isUnclosable = isPolygonUnclosable(lengths, angles);

        setCalculatedResults({
            areaM2: area,
            perimeter: perimeter,
            vertices: vertices,
            isUnclosable: isUnclosable,
        });
    };

    // Auto-calculate for initial or valid state if clicked
    const onSubmit = handleSubmit(handleCalculate);

    // Compute SVG viewBox and polygon points
    let svgPathPoints = "";
    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    if (calculatedResults && calculatedResults.vertices.length > 0) {
        const xs = calculatedResults.vertices.map(v => v[0]);
        const ys = calculatedResults.vertices.map(v => v[1]);
        minX = Math.min(...xs);
        maxX = Math.max(...xs);
        minY = Math.min(...ys);
        maxY = Math.max(...ys);

        const width = maxX - minX || 1;
        const height = maxY - minY || 1;

        const padding = 20;
        const svgSize = 300;
        const usableWidth = svgSize - 2 * padding;
        const usableHeight = svgSize - 2 * padding;
        const scale = Math.min(usableWidth / width, usableHeight / height);

        const svgCoords = calculatedResults.vertices.map(([vx, vy]) => {
            const sx = padding + (vx - minX) * scale;
            const sy = padding + (maxY - vy) * scale; // Flip Y axis
            return `${sx},${sy}`;
        });
        svgPathPoints = svgCoords.join(" ");
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50">Geometric Calculator</h1>
                <p className="text-slate-600 dark:text-zinc-400">
                    Input side lengths and interior angles to reconstruct any polygon, triangulate its area, and visualize its shape.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Panel (left) */}
                <div className="lg:col-span-7 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Polygon Dimensions</CardTitle>
                            <CardDescription>
                                Add or remove sides. Each side needs a length and the interior angle at its starting vertex.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 px-1">
                                        <div className="col-span-2">Vertex</div>
                                        <div className="col-span-5">Side Length (m)</div>
                                        <div className="col-span-4">Interior Angle (°)</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                                                P{index + 1}
                                            </div>
                                            <div className="col-span-5">
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Length in meters"
                                                    {...register(`rows.${index}.length` as const, {
                                                        required: true,
                                                        min: 0.0001,
                                                    })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Angle in degrees"
                                                    {...register(`rows.${index}.angle` as const, {
                                                        required: true,
                                                        min: 0,
                                                        max: 360,
                                                    })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length <= 3}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ length: 10, angle: 90 })}
                                        className="text-xs"
                                    >
                                        + Add Side
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                                    >
                                        Calculate
                                    </Button>
                                </div>

                                {/* Angle Sum Validation Notice */}
                                <div className={`p-3 rounded-lg border text-sm ${isAngleSumValid
                                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400"
                                    : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 text-amber-800 dark:text-amber-400"
                                    }`}>
                                    <div className="font-semibold mb-1">
                                        Angle Sum Check:
                                    </div>
                                    <div>
                                        For a valid {n}-sided polygon, the sum of interior angles must be <strong>{expectedAngleSum}°</strong>.
                                    </div>
                                    <div className="mt-1">
                                        Current Sum: <strong className={isAngleSumValid ? "text-emerald-600" : "text-amber-600 dark:text-amber-400"}>{currentAngleSum.toFixed(2)}°</strong>
                                        {isAngleSumValid ? " (Valid)" : " (Invalid Polygon Shape)"}
                                    </div>
                                    {!isAngleSumValid && (
                                        <div className="mt-1 text-xs text-red-500 font-semibold">
                                            ⚠️ Warning: Reconstructed shape will not close properly unless the sum is exactly {expectedAngleSum}°.
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Panel (right) */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle>Polygon Preview & Results</CardTitle>
                            <CardDescription>
                                Visual representation and area calculations of the shape.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-between space-y-6">
                            {/* SVG Container */}
                            <div className="w-full max-w-[320px] aspect-square bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden relative">
                                {calculatedResults ? (
                                    <svg viewBox="0 0 300 300" className="w-full h-full p-2">
                                        {/* Polygon Fill & Stroke */}
                                        <polygon
                                            points={svgPathPoints}
                                            fill={calculatedResults.isUnclosable ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.15)"}
                                            stroke={calculatedResults.isUnclosable ? "#ef4444" : "#2563eb"}
                                            strokeWidth="2"
                                            strokeLinejoin="round"
                                        />
                                        {/* Vertex dots */}
                                        {calculatedResults.vertices.map(([vx, vy], index) => {
                                            const width = maxX - minX || 1;
                                            const height = maxY - minY || 1;
                                            const padding = 20;
                                            const svgSize = 300;
                                            const usableWidth = svgSize - 2 * padding;
                                            const usableHeight = svgSize - 2 * padding;
                                            const scale = Math.min(usableWidth / width, usableHeight / height);
                                            const sx = padding + (vx - minX) * scale;
                                            const sy = padding + (maxY - vy) * scale;

                                            return (
                                                <g key={index}>
                                                    <circle
                                                        cx={sx}
                                                        cy={sy}
                                                        r="4"
                                                        fill={calculatedResults.isUnclosable ? "#dc2626" : "#1d4ed8"}
                                                    />
                                                    <text
                                                        x={sx + 8}
                                                        y={sy + 4}
                                                        fontSize="10"
                                                        fontWeight="bold"
                                                        fill="#475569"
                                                        className="dark:fill-zinc-400 select-none"
                                                    >
                                                        P{index + 1}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                ) : (
                                    <div className="text-center p-6 space-y-2">
                                        <div className="text-slate-400 dark:text-zinc-600 text-3xl">📐</div>
                                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                                            Enter dimensions and click &quot;Calculate&quot; to view polygon shape.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Result Display */}
                            {calculatedResults && (
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-500">Unit Preference</span>
                                        <select
                                            value={unitPreference}
                                            onChange={(e) => setUnitPreference(e.target.value as UnitType)}
                                            aria-label="Unit Preference"
                                            className="text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1"
                                        >
                                            <option value="m2">Square Meters (m²)</option>
                                            <option value="donum">Donum (Syrian)</option>
                                            <option value="hectare">Hectare (ha)</option>
                                            <option value="qasaba">Qasaba</option>
                                            <option value="ziraa">Ziraa</option>
                                        </select>
                                    </div>

                                    {calculatedResults.isUnclosable && (
                                        <div className="bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800 text-red-800 dark:text-red-400 p-3 rounded-lg text-xs font-medium">
                                            The input dimensions cannot geometrically close into a valid polygon. Please verify side lengths and angles.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                                                Calculated Area
                                            </div>
                                            {calculatedResults.isUnclosable ? (
                                                <div className="text-xs font-semibold text-red-500 dark:text-red-400 py-1">
                                                    Area calculation suppressed: Polygon does not close.
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                                                        {convertArea(calculatedResults.areaM2, unitPreference).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 4,
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {unitPreference === "m2" ? "sq. meters" : unitPreference}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                                                Perimeter
                                            </div>
                                            <div className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                                                {calculatedResults.perimeter.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })} m
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                meters
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
