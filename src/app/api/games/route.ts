import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { errorResponse } from '@/lib/http';

export async function GET(request: NextRequest) {
  try {
    const favoritesOnly = request.nextUrl.searchParams.get('favorites') === 'true';
    const { rows } = await db.query(`SELECT g.*, c.name AS console_name FROM games g JOIN consoles c ON c.id=g.console_id ${favoritesOnly ? 'WHERE g.is_favorite = TRUE' : ''} ORDER BY g.created_at DESC`);
    return NextResponse.json(rows);
  } catch (e) { return errorResponse(e); }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const consoleId = Number(form.get('console_id'));
    const title = String(form.get('title') ?? '').trim();
    const genre = String(form.get('genre') ?? '').trim();
    if (!consoleId || !title || !genre) return NextResponse.json({ error: 'console_id, title, dan genre wajib diisi' }, { status: 400 });
    const file = form.get('image');
    let image: { secure_url: string; public_id: string } | undefined;
    if (file instanceof File && file.size) image = await uploadImage(file, 'retrovault/games');
    const { rows } = await db.query(
      `INSERT INTO games (console_id,title,genre,release_year,image_url,image_public_id,description)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [consoleId, title, genre, form.get('release_year') || null, image?.secure_url ?? null, image?.public_id ?? null, form.get('description') || null]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) { return errorResponse(e); }
}
