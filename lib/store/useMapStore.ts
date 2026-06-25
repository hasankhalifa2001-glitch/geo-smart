import { create } from "zustand";

export type UnitType = "m2" | "donum" | "hectare" | "qasaba";

interface MapState {
    markers: [number, number][];
    areaM2: number | null;
    perimeterM: number | null;
    unitPreference: UnitType;
    addMarker: (marker: [number, number]) => void;
    removeMarker: (index: number) => void;
    clearMarkers: () => void;
    setResults: (areaM2: number | null, perimeterM: number | null) => void;
    setUnit: (unit: UnitType) => void;
}

export const useMapStore = create<MapState>((set) => ({
    markers: [],
    areaM2: null,
    perimeterM: null,
    unitPreference: "m2",

    addMarker: (marker) =>
        set((state) => ({
            markers: [...state.markers, marker],
        })),

    removeMarker: (index) =>
        set((state) => ({
            markers: state.markers.filter((_, i) => i !== index),
        })),

    clearMarkers: () =>
        set(() => ({
            markers: [],
            areaM2: null,
            perimeterM: null,
        })),

    setResults: (areaM2, perimeterM) =>
        set(() => ({
            areaM2,
            perimeterM,
        })),

    setUnit: (unitPreference) =>
        set(() => ({
            unitPreference,
        })),
}));
