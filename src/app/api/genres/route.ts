import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';

export async function GET() {
  try {
    const { rows } = await db.query("SELECT DISTINCT genre FROM games WHERE genre <> '' ORDER BY genre");
    return NextResponse.json(rows.map(row => row.genre));
  } catch (error) { return errorResponse(error); }
}
