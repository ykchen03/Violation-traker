import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate } = body;

    if (!plate) {
      return NextResponse.json({ error: "Plate is required" }, { status: 400 });
    }

    const normalizedPlate = plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Check if plate exists
    const data = await sql`
      SELECT * FROM violations
      WHERE plate = ${normalizedPlate}
      LIMIT 1
    `;
    console.log("Data fetched:", data);

    if (data.length > 0) {
      // Plate exists, increment count
      await sql`
        UPDATE violations
        SET count = count + 1, updated_at = NOW()
        WHERE plate = ${normalizedPlate}
      `;

      return NextResponse.json({
        message: `Plate '${normalizedPlate}' count incremented!`,
        plate: normalizedPlate,
        count: (data[0]?.count ?? 0) + 1,
      });
    } else {
      // Plate doesn't exist, insert new
      await sql`
        INSERT INTO violations (plate, count, created_at, updated_at)
        VALUES (${normalizedPlate}, 1, NOW(), NOW())
      `;

      return NextResponse.json({
        message: `'${normalizedPlate}' added successfully!`,
        plate: normalizedPlate,
        count: 1,
      });
    }
  } catch (err: any) {
    console.error("Error in POST /api/violations/add:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
