import * as turf from "@turf/turf";

/** Store coords are [lat, lng]; Turf/GeoJSON expects [lng, lat]. */
function toLngLatRing(coords: [number, number][]): [number, number][] {
    const ring = coords.map(([lat, lng]) => [lng, lat] as [number, number]);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push(first);
    }
    return ring;
}

export function calculateGeoArea(coords: [number, number][]): number {
    const ring = toLngLatRing(coords);
    const polygon = turf.polygon([ring]);
    return turf.area(polygon);
}

export function calculateGeoPerimeter(coords: [number, number][]): number {
    const ring = toLngLatRing(coords);
    const line = turf.lineString(ring);
    return turf.length(line, { units: "meters" });
}

export function isPolygonSelfIntersecting(coords: [number, number][]): boolean {
    if (coords.length < 3) return false;
    const ring = toLngLatRing(coords);
    const polygon = turf.polygon([ring]);
    const unkinked = turf.unkinkPolygon(polygon);
    return unkinked.features.length > 1;
}
