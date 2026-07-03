import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, mode, coordinates, areaM2, perimeterM, unitPreference } = body;

        if (!name || !mode) {
            return NextResponse.json({ error: "Name and mode are required" }, { status: 400 });
        }

        const projectId = crypto.randomUUID();

        await db.insert(projects).values({
            id: projectId,
            userId,
            name,
            mode,
            coordinates: coordinates || null,
            areaM2: areaM2 !== undefined ? Number(areaM2) : null,
            perimeterM: perimeterM !== undefined ? Number(perimeterM) : null,
            unitPreference: unitPreference || "m2",
        });

        return NextResponse.json({ success: true, projectId, message: "Project saved successfully" });
    } catch (error: unknown) {
        console.error("Error saving project:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
