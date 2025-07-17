import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL || "");

export async function GET(request: NextRequest) {
  try {
    const data = await sql`
      SELECT * FROM violations
      ORDER BY count DESC
    `;

    if (!data) {
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    return NextResponse.json({ violations: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
