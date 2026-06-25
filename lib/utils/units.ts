export type UnitType = "m2" | "donum" | "hectare" | "qasaba" | "ziraa";

/**
 * Converts area in square meters (m²) to the specified local/historical unit.
 * 
 * Conversion factors:
 * - Syrian Donum: 1,000 m²
 * - Hectare: 10,000 m²
 * - Qasaba: 25 m²
 * - Ziraa: 0.0576 m²
 */
export function convertArea(areaM2: number, unit: UnitType): number {
    switch (unit) {
        case "donum":
            return areaM2 / 1000;
        case "hectare":
            return areaM2 / 10000;
        case "qasaba":
            return areaM2 / 25;
        case "ziraa":
            return areaM2 / 0.0576;
        case "m2":
        default:
            return areaM2;
    }
}
