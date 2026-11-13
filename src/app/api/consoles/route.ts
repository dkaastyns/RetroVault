import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { errorResponse } from '@/lib/http';
export async function GET() {
  try { const { rows } = await db.query(`SELECT c.*, m.name AS manufacturer_name, COUNT(g.id)::int AS game_count FROM consoles c JOIN manufacturers m ON m.id=c.manufacturer_id LEFT JOIN games g ON g.console_id=c.id GROUP BY c.id,m.name ORDER BY c.name`); return NextResponse.json(rows); }
  catch (e) { return errorResponse(e); }
}
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData(); const manufacturerId = Number(form.get('manufacturer_id')); const name = String(form.get('name') ?? '').trim();
    if (!manufacturerId || !name) return NextResponse.json({ error: 'manufacturer_id dan name wajib diisi' }, { status: 400 });
    const file = form.get('image'); const image = file instanceof File && file.size ? await uploadImage(file, 'retrovault/consoles') : null;
    const { rows } = await db.query('INSERT INTO consoles (manufacturer_id,name,release_year,image_url,image_public_id) VALUES ($1,$2,$3,$4,$5) RETURNING *', [manufacturerId,name,form.get('release_year')||null,image?.secure_url||null,image?.public_id||null]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) { return errorResponse(e); }
}
