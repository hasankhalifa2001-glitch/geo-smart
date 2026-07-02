"use client";
import { useCallback, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polygon,
    useMapEvents,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { HugeiconsIcon } from "@hugeicons/react";

import {
    Search01Icon,
    Layers01Icon,
    Alert02Icon,
} from "@hugeicons/core-free-icons";

import { useMapStore } from "@/lib/store/useMapStore";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import MapProviderToggle from "@/components/map/MapProviderToggle";

const DEFAULT_CENTER: [number, number] = [33.51, 36.29];

const DEFAULT_ZOOM = 13;

const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const ESRI_URL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

type TileLayerType = "osm" | "satellite";

function createNumberedIcon(number: number): L.DivIcon {
    return L.divIcon({
        className: "",

        html: `<div style="

            width: 20px;

            height: 20px;

            border-radius: 50%;

            background: #10b981;

            color: white;

            font-weight: 700;

            font-size: 13px;

            display: flex;

            align-items: center;

            justify-content: center;

            border: 2px solid white;

            box-shadow: 0 2px 6px rgba(0,0,0,0.35);

        ">${number}</div>`,

        iconSize: [32, 32],

        iconAnchor: [16, 16],
    });
}

function MapClickHandler() {
    const addMarker = useMapStore((s) => s.addMarker);

    useMapEvents({
        click(e) {
            addMarker([e.latlng.lat, e.latlng.lng]);
        },
    });

    return null;
}

function DraggableMarker({
    index,

    position,
}: {
    index: number;

    position: [number, number];
}) {
    const updateMarker = useMapStore((s) => s.updateMarker);

    const icon = useMemo(() => createNumberedIcon(index + 1), [index]);

    return (
        <Marker
            position={position}
            icon={icon}
            draggable
            eventHandlers={{
                dragend: (e) => {
                    const latlng = e.target.getLatLng();

                    updateMarker(index, [latlng.lat, latlng.lng]);
                },
            }}
        />
    );
}

function GeocodingSearch() {
    const map = useMap();

    const [query, setQuery] = useState("");

    const [searching, setSearching] = useState(false);

    const handleSearch = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const trimmed = query.trim();

            if (!trimmed) return;

            setSearching(true);

            try {
                const params = new URLSearchParams({
                    q: trimmed,

                    format: "json",

                    limit: "1",
                });

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?${params}`,

                    { headers: { Accept: "application/json" } },
                );

                const results = await res.json();

                if (results.length > 0) {
                    const { lat, lon } = results[0];

                    map.flyTo([parseFloat(lat), parseFloat(lon)], 15, {
                        duration: 1.5,
                    });
                }
            } finally {
                setSearching(false);
            }
        },

        [query, map],
    );

    return (
        <form
            onSubmit={handleSearch}
            className="absolute bottom-4 left-1/2 z-[1000] flex w-[min(420px,calc(100%-2rem))] -translate-x-1/2 gap-2"
        >
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location…"
                className="bg-white/95 dark:bg-zinc-900/95 shadow-lg backdrop-blur-sm border-slate-200 dark:border-zinc-700"
            />

            <Button
                type="submit"
                disabled={searching}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
                <HugeiconsIcon icon={Search01Icon} className="size-4" />
            </Button>
        </form>
    );
}

function SelfIntersectionBanner() {
    const isSelfIntersecting = useMapStore((s) => s.isSelfIntersecting);

    if (!isSelfIntersecting) return null;

    return (
        <div className="absolute top-4 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 shadow-lg dark:border-red-800 dark:bg-red-950/90 dark:text-red-300">
            <HugeiconsIcon icon={Alert02Icon} className="size-4 shrink-0" />
            Boundary lines are crossing — please adjust markers
        </div>
    );
}

export default function LeafletMap() {
    const markers = useMapStore((s) => s.markers);
    const mapProvider = useMapStore((s) => s.mapProvider);

    const [tileLayer, setTileLayer] = useState<TileLayerType>("osm");

    const toggleTileLayer = useCallback(() => {
        setTileLayer((prev) => (prev === "osm" ? "satellite" : "osm"));
    }, []);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-full w-full z-0"
                scrollWheelZoom
                maxZoom={22}
            >
                {mapProvider === "google" ? (
                    <TileLayer
                        key="google-satellite"
                        attribution="&copy; Google"
                        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        maxZoom={22}
                    />
                ) : tileLayer === "osm" ? (
                    <TileLayer
                        key="leaflet-osm"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url={OSM_URL}
                        maxNativeZoom={18}
                        maxZoom={22}
                    />
                ) : (
                    <TileLayer
                        key="leaflet-satellite"
                        attribution="Tiles &copy; Esri"
                        url={ESRI_URL}
                    />
                )}

                <MapClickHandler />

                {markers.length >= 3 && (
                    <Polygon
                        positions={markers}
                        pathOptions={{
                            color: "#10b981",

                            fillColor: "#10b981",

                            fillOpacity: 0.25,

                            weight: 2,
                        }}
                    />
                )}

                {markers.map((position, index) => (
                    <DraggableMarker
                        key={`marker-${index}`}
                        index={index}
                        position={position}
                    />
                ))}

                <GeocodingSearch />
            </MapContainer>

            <SelfIntersectionBanner />

            <MapProviderToggle />

            <button
                type="button"
                onClick={toggleTileLayer}
                className={cn(
                    "absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-lg transition-colors",

                    "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm",

                    "border-slate-200 dark:border-zinc-700",

                    "hover:border-emerald-500 dark:hover:border-emerald-500/50",
                )}
                title="Toggle map layer"
            >
                <HugeiconsIcon icon={Layers01Icon} className="size-4" />

                {tileLayer === "osm" ? "Satellite" : "Street Map"}
            </button>
        </div>
    );
}
