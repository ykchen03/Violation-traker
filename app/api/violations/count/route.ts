import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL || "");

export async function GET(request: NextRequest) {
  try {
    const data = await sql`
            SELECT COUNT(*) AS count FROM violations
        `;

    if (!data || data.length === 0) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const count = data[0].count;

    return NextResponse.json({ count }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
