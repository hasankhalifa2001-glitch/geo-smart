"use client";

import { motion } from "framer-motion";
import { useMapStore, MapProviderType } from "@/lib/store/useMapStore";
import { cn } from "@/lib/utils";

export default function MapProviderToggle() {
    const mapProvider = useMapStore((s) => s.mapProvider);
    const setMapProvider = useMapStore((s) => s.setMapProvider);

    return (
        <div className="absolute top-3 left-11 sm:top-4 sm:left-12 z-[1000] flex p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md shadow-lg">
            {(["leaflet", "google"] as MapProviderType[]).map((provider) => {
                const isActive = mapProvider === provider;
                return (
                    <button
                        key={provider}
                        type="button"
                        onClick={() => setMapProvider(provider)}
                        className={cn(
                            "relative px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-semibold rounded-md sm:rounded-lg transition-colors duration-200 outline-none select-none capitalize cursor-pointer",
                            isActive
                                ? "text-black dark:text-zinc-950"
                                : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeMapProvider"
                                className="absolute inset-0 bg-emerald-500 rounded-md sm:rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">
                            {provider === "leaflet" ? (
                                <>
                                    <span className="inline sm:hidden">Leaflet</span>
                                    <span className="hidden sm:inline">Leaflet Map</span>
                                </>
                            ) : (
                                <>
                                    <span className="inline sm:hidden">Google</span>
                                    <span className="hidden sm:inline">Google Satellite</span>
                                </>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
