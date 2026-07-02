"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useMapStore } from "@/lib/store/useMapStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedRow {
    [key: string]: string;
}

export default function ProfessionalCalculatorPage() {
    const router = useRouter();
    const setMarkers = useMapStore((s) => s.setMarkers);

    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);

    // Column mappings
    const [latColumn, setLatColumn] = useState<string>("");
    const [lngColumn, setLngColumn] = useState<string>("");

    // Errors and validation
    const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-detect mappings based on header name matches
    const autoDetectColumns = (cols: string[]) => {
        const latPatterns = [/lat/i, /y/i, /north/i, /northing/i];
        const lngPatterns = [/lng/i, /lon/i, /long/i, /x/i, /east/i, /easting/i];

        let foundLat = "";
        let foundLng = "";

        for (const col of cols) {
            if (!foundLat && latPatterns.some(p => p.test(col))) {
                foundLat = col;
            }
            if (!foundLng && lngPatterns.some(p => p.test(col))) {
                foundLng = col;
            }
        }

        // Fallbacks
        if (!foundLat && cols.length > 0) foundLat = cols[0];
        if (!foundLng && cols.length > 1) foundLng = cols[1];

        setLatColumn(foundLat);
        setLngColumn(foundLng);
    };

    // Parse the file with papaparse
    const handleFileParse = (file: File) => {
        setFileName(file.name);
        setImportErrorMsg(null);
        setParsedData(null);

        Papa.parse<ParsedRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setImportErrorMsg("Error parsing file. Please ensure it is a valid CSV/TXT file.");
                    return;
                }

                const rows = results.data;
                if (rows.length === 0) {
                    setImportErrorMsg("The file is empty.");
                    return;
                }

                const detectedHeaders = Object.keys(rows[0]);
                setHeaders(detectedHeaders);
                setParsedData(rows);
                autoDetectColumns(detectedHeaders);
            },
            error: (err) => {
                setImportErrorMsg(`Error reading file: ${err.message}`);
            }
        });
    };

    // Compute validation report and error message during render
    let validationReport = null;
    let mappingErrorMsg = null;

    if (parsedData && latColumn && lngColumn) {
        const invalidRows: { index: number; row: ParsedRow; reason: string }[] = [];
        const validCoords: [number, number][] = [];

        parsedData.forEach((row, idx) => {
            const latValStr = row[latColumn]?.trim();
            const lngValStr = row[lngColumn]?.trim();

            if (!latValStr || !lngValStr) {
                invalidRows.push({
                    index: idx + 1,
                    row,
                    reason: "Missing coordinate value in mapped columns."
                });
                return;
            }

            const lat = Number(latValStr);
            const lng = Number(lngValStr);

            if (isNaN(lat) || isNaN(lng)) {
                invalidRows.push({
                    index: idx + 1,
                    row,
                    reason: `Invalid numeric value: lat="${latValStr}", lng="${lngValStr}".`
                });
                return;
            }

            // plausible bounds check
            if (lat < -90 || lat > 90) {
                invalidRows.push({
                    index: idx + 1,
                    row,
                    reason: `Latitude ${lat}° is outside plausible geographic bounds (-90 to 90).`
                });
                return;
            }

            if (lng < -180 || lng > 180) {
                invalidRows.push({
                    index: idx + 1,
                    row,
                    reason: `Longitude ${lng}° is outside plausible geographic bounds (-180 to 180).`
                });
                return;
            }

            validCoords.push([lat, lng]);
        });

        validationReport = {
            total: parsedData.length,
            valid: validCoords.length,
            invalidRows,
            validCoords,
        };

        if (validCoords.length < 3) {
            mappingErrorMsg = `A valid polygon requires at least 3 points. Found only ${validCoords.length} valid coordinate rows.`;
        }
    }

    const errorMsg = importErrorMsg || mappingErrorMsg;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileParse(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileParse(file);
        }
    };

    // Confirm mapping and redirect
    const handleConfirmMapping = () => {
        if (!validationReport || validationReport.validCoords.length < 3) {
            setImportErrorMsg("Cannot load coordinates: fewer than 3 valid points.");
            return;
        }

        // Set store markers
        setMarkers(validationReport.validCoords);

        // Redirect to Map Mode view
        router.push("/calculator/map");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4 py-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50">Professional GPS File Upload</h1>
                <p className="text-slate-600 dark:text-zinc-400">
                    Upload .csv or .txt survey coordinate sheets, map columns to geographic coordinates, and automatically project your boundaries on the interactive map.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6 space-y-4">
                    {/* Drag and Drop Zone */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Coordinates</CardTitle>
                            <CardDescription>Drag and drop or select your survey sheet file.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging
                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/10"
                                    : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    id="file-input"
                                    ref={fileInputRef}
                                    onChange={handleFileInput}
                                    accept=".csv,.txt"
                                    aria-label="Upload CSV or TXT Coordinate file"
                                    className="hidden"
                                />
                                <div className="text-4xl mb-3">📁</div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                    {fileName ? fileName : "Drag & drop a file here, or click to browse"}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                    Supports .csv and .txt files containing coordinates
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Column Mapping UI */}
                    {parsedData && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Assign Columns</CardTitle>
                                <CardDescription>Map headers from your file to coordinate roles.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="lat-col-select" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                            Latitude Column (Y)
                                        </label>
                                        <select
                                            id="lat-col-select"
                                            value={latColumn}
                                            onChange={(e) => setLatColumn(e.target.value)}
                                            className="w-full text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2"
                                        >
                                            <option value="">-- Select Column --</option>
                                            {headers.map((h) => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="lng-col-select" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                            Longitude Column (X)
                                        </label>
                                        <select
                                            id="lng-col-select"
                                            value={lngColumn}
                                            onChange={(e) => setLngColumn(e.target.value)}
                                            className="w-full text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2"
                                        >
                                            <option value="">-- Select Column --</option>
                                            {headers.map((h) => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {validationReport && (
                                    <div className="pt-2">
                                        <Button
                                            onClick={handleConfirmMapping}
                                            disabled={validationReport.valid < 3}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Confirm & Map Boundaries ({validationReport.valid} points)
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-6 space-y-4">
                    {/* Error Messages */}
                    {errorMsg && (
                        <Card className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/15">
                            <CardContent className="pt-6">
                                <div className="flex gap-2 text-red-800 dark:text-red-400 text-sm">
                                    <span className="text-lg">⚠️</span>
                                    <div className="space-y-1">
                                        <p className="font-semibold">Import Error</p>
                                        <p>{errorMsg}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Validation Report & Invalid Rows Flagging */}
                    {validationReport && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Validation Summary</CardTitle>
                                <CardDescription>Coordinate checks and bounds verification.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
                                        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">Parsed Rows</span>
                                        <span className="text-2xl font-bold">{validationReport.total}</span>
                                    </div>
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/10 rounded-lg border border-emerald-100 dark:border-emerald-950">
                                        <span className="text-xs font-semibold text-emerald-600/70 block uppercase tracking-wide">Valid Points</span>
                                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{validationReport.valid}</span>
                                    </div>
                                </div>

                                {validationReport.invalidRows.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                                            ⚠️ Flagged Rows ({validationReport.invalidRows.length})
                                        </h3>
                                        <div className="max-h-[220px] overflow-y-auto border border-slate-100 dark:border-zinc-800 rounded-lg divide-y divide-slate-100 dark:divide-zinc-800 bg-slate-50/30">
                                            {validationReport.invalidRows.map(({ index, reason }) => (
                                                <div key={index} className="p-2.5 text-xs text-slate-600 dark:text-zinc-400">
                                                    <span className="font-bold text-slate-800 dark:text-zinc-200">Row {index}:</span> {reason}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Sample Template Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Coordinate Template</CardTitle>
                            <CardDescription>Ensure your CSV/TXT matches this expected structure.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p className="text-slate-500">
                                CSV sheets should contain columns for Latitude and Longitude. Below is a standard sample layout:
                            </p>
                            <pre className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg font-mono text-xs overflow-x-auto text-slate-800 dark:text-zinc-300">
                                {`Point_ID,Latitude,Longitude
P1,33.5138,36.2765
P2,33.5148,36.2765
P3,33.5148,36.2775
P4,33.5138,36.2775`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
