import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
type Context={params:{id:string}};
export async function GET(_:NextRequest,{params}:Context){try{const {rows}=await db.query('SELECT * FROM transactions WHERE game_id=$1 ORDER BY created_at DESC',[params.id]);return NextResponse.json(rows);}catch(e){return errorResponse(e);}}
export async function POST(req:NextRequest,{params}:Context){try{const b=await req.json();if(!['Koleksi','Wishlist','Terjual'].includes(b.status))return NextResponse.json({error:'Status tidak valid'},{status:400});const {rows}=await db.query('INSERT INTO transactions(game_id,status,purchase_price,purchase_date) VALUES($1,$2,$3,$4) RETURNING *',[params.id,b.status,b.purchase_price||0,b.purchase_date||null]);return NextResponse.json(rows[0],{status:201});}catch(e){return errorResponse(e);}}
