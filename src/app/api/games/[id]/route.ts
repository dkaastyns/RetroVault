import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteImage, uploadImage } from '@/lib/cloudinary';
import { errorResponse } from '@/lib/http';

type Context = { params: { id: string } };
export async function GET(_: NextRequest, { params }: Context) {
  try {
    const game = await db.query(`SELECT g.*, c.name AS console_name, c.id AS console_id, m.name AS manufacturer_name FROM games g JOIN consoles c ON c.id=g.console_id JOIN manufacturers m ON m.id=c.manufacturer_id WHERE g.id=$1`, [params.id]);
    if (!game.rowCount) return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    const [transactions, reviews, images] = await Promise.all([
      db.query('SELECT * FROM transactions WHERE game_id=$1 ORDER BY created_at DESC', [params.id]),
      db.query('SELECT * FROM game_reviews WHERE game_id=$1 ORDER BY created_at DESC', [params.id]),
      db.query('SELECT image_url FROM game_images WHERE game_id=$1 ORDER BY id', [params.id])
    ]);
    return NextResponse.json({ ...game.rows[0], images: images.rows.map(row => row.image_url), transactions: transactions.rows, reviews: reviews.rows });
  } catch (e) { return errorResponse(e); }
}
export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const form = await request.formData();
    const current = await db.query('SELECT image_public_id FROM games WHERE id=$1', [params.id]);
    if (!current.rowCount) return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    const title = String(form.get('title') ?? '').trim();
    const genre = String(form.get('genre') ?? '').trim();
    const description = String(form.get('description') ?? '').trim();
    if (form.has('title') && (title.length < 2 || title.length > 200)) return NextResponse.json({ error: 'Judul harus 2–200 karakter.' }, { status: 400 });
    if (form.has('genre') && (genre.length < 2 || genre.length > 100)) return NextResponse.json({ error: 'Genre harus 2–100 karakter.' }, { status: 400 });
    if (form.has('description') && description.length > 0 && description.length < 20) return NextResponse.json({ error: 'Deskripsi minimal 20 karakter.' }, { status: 400 });
    const file = form.get('image');
    let imageUrl = form.get('image_url') || null;
    let publicId: string | null = null;
    if (file instanceof File && file.size) {
      const uploaded = await uploadImage(file, 'retrovault/games'); imageUrl = uploaded.secure_url; publicId = uploaded.public_id;
    }
    const { rows } = await db.query(
      `UPDATE games SET console_id=COALESCE($1,console_id), title=COALESCE($2,title), genre=COALESCE($3,genre),
       release_year=COALESCE($4,release_year), description=CASE WHEN $5 THEN $6 ELSE description END,
       image_url=COALESCE($7,image_url), image_public_id=COALESCE($8,image_public_id), status=COALESCE($9,status) WHERE id=$10 RETURNING *`,
      [form.get('console_id') || null, form.has('title') ? title : null, form.has('genre') ? genre : null, form.get('release_year') || null, form.has('description'), form.has('description') ? (description || null) : null, imageUrl, publicId, ['active','draft','archived'].includes(String(form.get('status'))) ? form.get('status') : null, params.id]
    );
    if (publicId) await deleteImage(current.rows[0].image_public_id);
    return NextResponse.json(rows[0]);
  } catch (e) { return errorResponse(e); }
}
export async function DELETE(_: NextRequest, { params }: Context) {
  try {
    const { rows } = await db.query('DELETE FROM games WHERE id=$1 RETURNING image_public_id', [params.id]);
    if (!rows.length) return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    await deleteImage(rows[0].image_public_id);
    return new NextResponse(null, { status: 204 });
  } catch (e) { return errorResponse(e); }
}
