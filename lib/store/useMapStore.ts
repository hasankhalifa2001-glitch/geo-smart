import { create } from "zustand";

export type UnitType = "m2" | "donum" | "hectare" | "qasaba";

interface MapState {
    markers: [number, number][];
    areaM2: number | null;
    perimeterM: number | null;
    isSelfIntersecting: boolean;
    unitPreference: UnitType;
    addMarker: (marker: [number, number]) => void;
    updateMarker: (index: number, marker: [number, number]) => void;
    removeMarker: (index: number) => void;
    clearMarkers: () => void;
    setResults: (
        areaM2: number | null,
        perimeterM: number | null,
        isSelfIntersecting?: boolean
    ) => void;
    setUnit: (unit: UnitType) => void;
}

export const useMapStore = create<MapState>((set) => ({
    markers: [],
    areaM2: null,
    perimeterM: null,
    isSelfIntersecting: false,
    unitPreference: "m2",

    addMarker: (marker) =>
        set((state) => ({
            markers: [...state.markers, marker],
        })),

    updateMarker: (index, marker) =>
        set((state) => ({
            markers: state.markers.map((m, i) => (i === index ? marker : m)),
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
            isSelfIntersecting: false,
        })),

    setResults: (areaM2, perimeterM, isSelfIntersecting = false) =>
        set(() => ({
            areaM2,
            perimeterM,
            isSelfIntersecting,
        })),

    setUnit: (unitPreference) =>
        set(() => ({
            unitPreference,
        })),
}));
