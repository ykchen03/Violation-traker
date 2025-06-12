import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL || "");

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const term = url.searchParams.get("term") || "";

    if (!term) {
      return NextResponse.json(
        { error: "Search term is required" },
        { status: 400 }
      );
    }

    const data = await sql`
            SELECT * FROM violations
            WHERE plate ILIKE ${term}
            ORDER BY count DESC
        `;

    return NextResponse.json({ violations: data });
  } catch (err: any) {
    console.error("Error in GET /api/violations/search:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
