import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
type Context={params:{id:string}};
export async function GET(_:NextRequest,{params}:Context){try{const {rows}=await db.query('SELECT * FROM game_reviews WHERE game_id=$1 ORDER BY created_at DESC',[params.id]);return NextResponse.json(rows);}catch(e){return errorResponse(e);}}
export async function POST(req:NextRequest,{params}:Context){try{const b=await req.json();const rating=Number(b.rating);if(rating<1||rating>5)return NextResponse.json({error:'Rating harus 1 sampai 5'},{status:400});const {rows}=await db.query('INSERT INTO game_reviews(game_id,rating,status_tamat,review_text) VALUES($1,$2,$3,$4) RETURNING *',[params.id,rating,!!b.status_tamat,b.review_text||'']);return NextResponse.json(rows[0],{status:201});}catch(e){return errorResponse(e);}}
