import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { projects, transactions } from "@/lib/db/schema";
import { and, eq, or } from "drizzle-orm";
import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 60,
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomColor: "#10b981",
        borderBottomStyle: "solid",
        paddingBottom: 15,
        marginBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#10b981",
    },
    timestamp: {
        fontSize: 9,
        color: "#6b7280",
        textAlign: "right",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#111827",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    gridItem: {
        width: "50%",
        marginBottom: 10,
    },
    label: {
        fontSize: 10,
        color: "#6b7280",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1f2937",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 8,
        color: "#111827",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        borderBottomStyle: "solid",
        paddingBottom: 4,
    },
    table: {
        marginTop: 10,
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        borderBottomStyle: "solid",
        padding: 6,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        borderBottomWidth: 2,
        borderBottomColor: "#d1d5db",
        borderBottomStyle: "solid",
        padding: 6,
    },
    tableCellHeader: {
        flex: 1,
        fontSize: 9,
        fontWeight: "bold",
        color: "#374151",
    },
    tableCell: {
        flex: 1,
        fontSize: 9,
        color: "#4b5563",
    },
    stampContainer: {
        marginTop: 40,
        alignSelf: "flex-end",
        borderWidth: 2,
        borderColor: "#d1d5db",
        borderStyle: "dashed",
        borderRadius: 4,
        padding: 15,
        width: 140,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    stampText: {
        fontSize: 9,
        color: "#9ca3af",
        fontWeight: "bold",
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#9ca3af",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        borderTopStyle: "solid",
        paddingTop: 8,
    },
});

interface PDFProps {
    project: typeof projects.$inferSelect;
    timestampStr: string;
}

// Render pdf using React.createElement directly to avoid JSX parsing and auto-formatter issues
function createReportPDFElement({ project, timestampStr }: PDFProps) {
    const coordinates = project.coordinates || [];
    const areaM2 = project.areaM2 || 0;
    const perimeterM = project.perimeterM || 0;

    return React.createElement(
        Document,
        {},
        React.createElement(
            Page,
            { size: "A4", style: styles.page },
            // Header
            React.createElement(
                View,
                { style: styles.header },
                React.createElement(
                    View,
                    {},
                    React.createElement(Text, { style: styles.logo }, "GeoSmart"),
                    React.createElement(Text, { style: { fontSize: 9, color: "#4b5563" } }, "Premium Survey & GIS Calculations")
                ),
                React.createElement(
                    View,
                    { style: { justifyContent: "flex-end" } },
                    React.createElement(Text, { style: styles.timestamp }, "Official Survey Report"),
                    React.createElement(Text, { style: styles.timestamp }, timestampStr)
                )
            ),

            // Report Title
            React.createElement(Text, { style: styles.title }, `Survey Calculation Report: ${project.name}`),

            // Metadata grid
            React.createElement(
                View,
                { style: styles.grid },
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Project Name"),
                    React.createElement(Text, { style: styles.value }, project.name)
                ),
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Calculation Mode"),
                    React.createElement(Text, { style: styles.value }, project.mode.toUpperCase())
                ),
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Area (Square Meters)"),
                    React.createElement(Text, { style: styles.value }, `${areaM2.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²`)
                ),
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Perimeter"),
                    React.createElement(Text, { style: styles.value }, `${perimeterM.toLocaleString(undefined, { maximumFractionDigits: 2 })} m`)
                ),
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Area (Syrian Donum)"),
                    React.createElement(Text, { style: styles.value }, `${(areaM2 / 1000).toLocaleString(undefined, { maximumFractionDigits: 4 })} Donum`)
                ),
                React.createElement(
                    View,
                    { style: styles.gridItem },
                    React.createElement(Text, { style: styles.label }, "Area (Hectare)"),
                    React.createElement(Text, { style: styles.value }, `${(areaM2 / 10000).toLocaleString(undefined, { maximumFractionDigits: 4 })} Ha`)
                )
            ),

            // Coordinate Table Title
            React.createElement(Text, { style: styles.sectionTitle }, `Boundary Coordinates (${coordinates.length} points)`),

            // Coordinate Table
            React.createElement(
                View,
                { style: styles.table },
                React.createElement(
                    View,
                    { style: styles.tableHeader, wrap: false },
                    React.createElement(Text, { style: [styles.tableCellHeader, { flex: 0.5 }] }, "Point #"),
                    React.createElement(Text, { style: styles.tableCellHeader }, "Latitude (Y)"),
                    React.createElement(Text, { style: styles.tableCellHeader }, "Longitude (X)")
                ),
                ...coordinates.map((coord, idx) =>
                    React.createElement(
                        View,
                        { key: idx, style: styles.tableRow, wrap: false },
                        React.createElement(Text, { style: [styles.tableCell, { flex: 0.5 }] }, `${idx + 1}`),
                        React.createElement(Text, { style: styles.tableCell }, coord[0].toFixed(7)),
                        React.createElement(Text, { style: styles.tableCell }, coord[1].toFixed(7))
                    )
                )
            ),

            // Stamp Placeholder
            React.createElement(
                View,
                { style: styles.stampContainer, wrap: false },
                React.createElement(Text, { style: styles.stampText }, "GEOSMART"),
                React.createElement(Text, { style: [styles.stampText, { fontSize: 7, marginTop: 4 }] }, "OFFICIAL STAMP")
            ),

            // Footer (Dynamic Page Numbers)
            React.createElement(
                Text,
                {
                    style: styles.footer,
                    render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`,
                    fixed: true
                }
            )
        )
    );
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Fetch project and verify ownership
        const [project] = await db
            .select()
            .from(projects)
            .where(and(eq(projects.id, id), eq(projects.userId, userId)));

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Verify premium payment exists for this project
        const userTransactions = await db
            .select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.projectId, id),
                    eq(transactions.userId, userId),
                    or(eq(transactions.status, "paid"), eq(transactions.status, "completed"))
                )
            );

        if (userTransactions.length === 0) {
            return NextResponse.json({ error: "Payment required" }, { status: 402 });
        }

        // Generate PDF
        const timestampStr = new Date().toLocaleString();
        const pdfBuffer = await renderToBuffer(createReportPDFElement({ project, timestampStr }));

        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="geosmart_report_${id}.pdf"`,
            },
        });
    } catch (error: unknown) {
        console.error("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
