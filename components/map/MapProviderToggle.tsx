"use client";

import { motion } from "framer-motion";
import { useMapStore, MapProviderType } from "@/lib/store/useMapStore";
import { cn } from "@/lib/utils";

export default function MapProviderToggle() {
    const mapProvider = useMapStore((s) => s.mapProvider);
    const setMapProvider = useMapStore((s) => s.setMapProvider);

    return (
        <div className="absolute top-4 left-12 z-[1000] flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md shadow-lg">
            {(["leaflet", "google"] as MapProviderType[]).map((provider) => {
                const isActive = mapProvider === provider;
                return (
                    <button
                        key={provider}
                        type="button"
                        onClick={() => setMapProvider(provider)}
                        className={cn(
                            "relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 outline-none select-none capitalize cursor-pointer",
                            isActive
                                ? "text-black dark:text-zinc-950"
                                : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeMapProvider"
                                className="absolute inset-0 bg-emerald-500 rounded-lg -z-10"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">
                            {provider === "leaflet" ? "Leaflet Map" : "Google Satellite"}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
