import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { errorResponse } from '@/lib/http';

export async function GET(request: NextRequest) {
  try {
    const favoritesOnly = request.nextUrl.searchParams.get('favorites') === 'true';
    const status = request.nextUrl.searchParams.get('status') || 'active';
    const { rows } = await db.query(`SELECT g.*, c.name AS console_name FROM games g JOIN consoles c ON c.id=g.console_id WHERE g.status=$1 ${favoritesOnly ? 'AND g.is_favorite = TRUE' : ''} ORDER BY g.created_at DESC`, [status]);
    return NextResponse.json(rows);
  } catch (e) { return errorResponse(e); }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const consoleId = Number(form.get('console_id'));
    const title = String(form.get('title') ?? '').trim();
    const genre = String(form.get('genre') ?? '').trim();
    const description = String(form.get('description') ?? '').trim();
    const status = String(form.get('status') ?? 'active');
    if (!consoleId || title.length < 2 || title.length > 200 || genre.length < 2 || genre.length > 100)
      return NextResponse.json({ error: 'Judul (2–200 karakter), konsol, dan genre (2–100 karakter) wajib diisi.' }, { status: 400 });
    if (description && description.length < 20) return NextResponse.json({ error: 'Deskripsi minimal 20 karakter.' }, { status: 400 });
    if (!['active', 'draft'].includes(status)) return NextResponse.json({ error: 'Status game tidak valid.' }, { status: 400 });
    const files = form.getAll('images').filter((file): file is File => file instanceof File && file.size > 0);
    if (!files.length) { const oldFile = form.get('image'); if (oldFile instanceof File && oldFile.size) files.push(oldFile); }
    if (files.length > 10) return NextResponse.json({ error: 'Maksimal 10 gambar per game.' }, { status: 400 });
    if (files.some(file => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024)) return NextResponse.json({ error: 'Setiap gambar harus berformat gambar dan maksimal 10 MB.' }, { status: 400 });
    const images = await Promise.all(files.map(file => uploadImage(file, 'retrovault/games')));
    const { rows } = await db.query(
      `INSERT INTO games (console_id,title,genre,release_year,image_url,image_public_id,description,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [consoleId, title, genre, form.get('release_year') || null, images[0]?.secure_url ?? null, images[0]?.public_id ?? null, description || null, status]
    );
    if (images.length) await db.query('INSERT INTO game_images(game_id,image_url,image_public_id) SELECT $1, image_url, public_id FROM unnest($2::text[],$3::text[]) AS imgs(image_url,public_id)', [rows[0].id, images.map(i => i.secure_url), images.map(i => i.public_id)]);
    rows[0].images = images.map(i => i.secure_url);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) { return errorResponse(e); }
}
