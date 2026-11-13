import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
type Context={params:{id:string;reviewId:string}};
export async function PUT(req:NextRequest,{params}:Context){try{const b=await req.json();const {rows}=await db.query('UPDATE game_reviews SET rating=COALESCE($1,rating),status_tamat=COALESCE($2,status_tamat),review_text=COALESCE($3,review_text) WHERE id=$4 AND game_id=$5 RETURNING *',[b.rating??null,b.status_tamat??null,b.review_text??null,params.reviewId,params.id]);return rows.length?NextResponse.json(rows[0]):NextResponse.json({error:'Ulasan tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
export async function DELETE(_:NextRequest,{params}:Context){try{const {rowCount}=await db.query('DELETE FROM game_reviews WHERE id=$1 AND game_id=$2',[params.reviewId,params.id]);return rowCount?new NextResponse(null,{status:204}):NextResponse.json({error:'Ulasan tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
