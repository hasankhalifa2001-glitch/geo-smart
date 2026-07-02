import earcut from "earcut";

/**
 * Reconstructs polygon vertices from side lengths and interior angles using trigonometric traversal.
 * Each vertex position is computed from the previous using the side length and cumulative bearing.
 * 
 * @param sides - Array of side lengths. Length of sides is n.
 * @param angles - Array of interior angles in degrees. Length of angles is n.
 * @returns Array of [x, y] vertex coordinates.
 */
/**
 * Checks if the polygon constructed by the given sides and angles returns to the origin.
 * 
 * @param sides - Array of side lengths.
 * @param angles - Array of interior angles in degrees.
 * @param threshold - The maximum allowed distance from the final vertex to the origin (default 0.5).
 * @returns boolean indicating if the polygon is unclosable.
 */
export function isPolygonUnclosable(sides: number[], angles: number[], threshold: number = 0.5): boolean {
    const n = sides.length;
    if (n < 3) return false;

    // We reconstruct vertices and track the position
    let x = 0;
    let y = 0;
    let cumulativeBearingRad = 0;

    for (let i = 0; i < n - 1; i++) {
        const s = sides[i];
        x += s * Math.cos(cumulativeBearingRad);
        y += s * Math.sin(cumulativeBearingRad);

        const nextAngleDeg = angles[i + 1];
        const deflectionDeg = 180 - nextAngleDeg;
        cumulativeBearingRad += (deflectionDeg * Math.PI) / 180;
    }

    // Final traversal using the last side
    const lastSide = sides[n - 1];
    const finalX = x + lastSide * Math.cos(cumulativeBearingRad);
    const finalY = y + lastSide * Math.sin(cumulativeBearingRad);

    const distance = Math.hypot(finalX, finalY);
    return distance > threshold;
}

export function reconstructGeometricVertices(sides: number[], angles: number[]): [number, number][] {
    const n = sides.length;
    if (n < 3) return [];

    const vertices: [number, number][] = [];
    let x = 0;
    let y = 0;
    vertices.push([x, y]);

    let cumulativeBearingRad = 0; // Starts at 0 along X-axis

    for (let i = 0; i < n - 1; i++) {
        const s = sides[i];

        x += s * Math.cos(cumulativeBearingRad);
        y += s * Math.sin(cumulativeBearingRad);
        vertices.push([x, y]);

        const nextAngleDeg = angles[i + 1];
        const deflectionDeg = 180 - nextAngleDeg;
        cumulativeBearingRad += (deflectionDeg * Math.PI) / 180;
    }

    return vertices;
}

/**
 * Calculates the area of a reconstructed polygon using earcut triangulation and Heron's Formula.
 * 
 * @param sides - Array of side lengths.
 * @param angles - Array of interior angles in degrees.
 * @returns Calculated area.
 */
export function calculateGeometricArea(sides: number[], angles: number[]): number {
    const vertices = reconstructGeometricVertices(sides, angles);
    if (vertices.length < 3) return 0;

    // Prepare flat coordinates array for earcut
    const flatCoords: number[] = [];
    for (const [vx, vy] of vertices) {
        flatCoords.push(vx, vy);
    }

    // Triangulate
    const triangleIndices = earcut(flatCoords);

    // Sum area of triangles using Heron's formula
    let totalArea = 0;
    for (let i = 0; i < triangleIndices.length; i += 3) {
        const i0 = triangleIndices[i];
        const i1 = triangleIndices[i + 1];
        const i2 = triangleIndices[i + 2];

        const p0 = vertices[i0];
        const p1 = vertices[i1];
        const p2 = vertices[i2];

        // Side lengths of the triangle
        const a = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
        const b = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
        const c = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]);

        // Semi-perimeter
        const s = (a + b + c) / 2;
        // Heron's formula
        const triangleArea = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
        totalArea += triangleArea;
    }

    return totalArea;
}

/**
 * Calculates the perimeter of a geometric polygon (simple sum of side lengths).
 * 
 * @param sides - Array of side lengths.
 * @returns Calculated perimeter.
 */
export function calculateGeometricPerimeter(sides: number[]): number {
    return sides.reduce((sum, s) => sum + Number(s), 0);
}
