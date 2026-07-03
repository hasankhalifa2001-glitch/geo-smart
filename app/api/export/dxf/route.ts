import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { projects, transactions } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import Drawing from "dxf-writer";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        // Fetch project and verify ownership
        const [project] = await db
            .select()
            .from(projects)
            .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Verify premium payment exists for this project
        const userTransactions = await db
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.projectId, projectId),
                    eq(transactions.userId, userId),
                    or(eq(transactions.status, "paid"), eq(transactions.status, "completed"))
                )
            );

        if (userTransactions.length === 0) {
            return NextResponse.json({ error: "Payment required" }, { status: 402 });
        }

        const coordinates = project.coordinates || [];
        if (coordinates.length === 0) {
            return NextResponse.json({ error: "No coordinates to export" }, { status: 400 });
        }

        // Initialize DXF Drawing
        const d = new Drawing();

        // Use coordinates to draw DXF polyline
        // project.coordinates is [latitude, longitude], i.e., [y, x].
        // DXF uses standard Cartesian coordinates [x, y], so swap them: X = longitude, Y = latitude
        const dxfPoints: [number, number][] = coordinates.map((coord) => [coord[1], coord[0]]);

        // Draw closed polyline
        d.drawPolyline(dxfPoints, true);

        const dxfString = d.toDxfString();

        return new Response(dxfString, {
            headers: {
                "Content-Type": "application/dxf",
                "Content-Disposition": `attachment; filename="geosmart_export_${projectId}.dxf"`,
            },
        });
    } catch (error: unknown) {
        console.error("DXF export error:", error);
        return NextResponse.json({ error: "Failed to export DXF" }, { status: 500 });
    }
}
