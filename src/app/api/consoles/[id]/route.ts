import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteImage, uploadImage } from '@/lib/cloudinary';
import { errorResponse } from '@/lib/http';
type Context = { params: { id: string } };
export async function GET(_: NextRequest, { params }: Context) {
  try { const consoleRow = await db.query('SELECT c.*,m.name AS manufacturer_name FROM consoles c JOIN manufacturers m ON m.id=c.manufacturer_id WHERE c.id=$1',[params.id]); if (!consoleRow.rowCount) return NextResponse.json({error:'Konsol tidak ditemukan'},{status:404}); const games=await db.query('SELECT * FROM games WHERE console_id=$1 ORDER BY title',[params.id]); return NextResponse.json({...consoleRow.rows[0],games:games.rows}); }
  catch(e){return errorResponse(e);}
}
export async function PUT(req: NextRequest,{params}:Context){
  try { const form=await req.formData(); const current=await db.query('SELECT image_public_id FROM consoles WHERE id=$1',[params.id]); if(!current.rowCount)return NextResponse.json({error:'Konsol tidak ditemukan'},{status:404}); const file=form.get('image'); let imageUrl=form.get('image_url')||null; let publicId:null|string=null; if(file instanceof File&&file.size){const uploaded=await uploadImage(file,'retrovault/consoles');imageUrl=uploaded.secure_url;publicId=uploaded.public_id;} const {rows}=await db.query('UPDATE consoles SET manufacturer_id=COALESCE($1,manufacturer_id),name=COALESCE($2,name),release_year=COALESCE($3,release_year),image_url=COALESCE($4,image_url),image_public_id=COALESCE($5,image_public_id) WHERE id=$6 RETURNING *',[form.get('manufacturer_id')||null,form.get('name')||null,form.get('release_year')||null,imageUrl,publicId,params.id]); if(publicId)await deleteImage(current.rows[0].image_public_id); return NextResponse.json(rows[0]); }
  catch(e){return errorResponse(e);}
}
export async function DELETE(_:NextRequest,{params}:Context){try{const {rows}=await db.query('DELETE FROM consoles WHERE id=$1 RETURNING image_public_id',[params.id]);if(!rows.length)return NextResponse.json({error:'Konsol tidak ditemukan'},{status:404});await deleteImage(rows[0].image_public_id);return new NextResponse(null,{status:204});}catch(e){return errorResponse(e);}}
