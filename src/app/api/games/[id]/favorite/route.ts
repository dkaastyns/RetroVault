import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';

type Context = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const body = await request.json();
    if (typeof body.is_favorite !== 'boolean') {
      return NextResponse.json({ error: 'is_favorite harus berupa boolean' }, { status: 400 });
    }
    const { rows } = await db.query(
      'UPDATE games SET is_favorite=$1 WHERE id=$2 RETURNING id,is_favorite',
      [body.is_favorite, params.id]
    );
    if (!rows.length) return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) { return errorResponse(error); }
}
