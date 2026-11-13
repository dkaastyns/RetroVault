import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
type Context={params:{id:string;transactionId:string}};
export async function PUT(req:NextRequest,{params}:Context){try{const b=await req.json();const {rows}=await db.query('UPDATE transactions SET status=COALESCE($1,status),purchase_price=COALESCE($2,purchase_price),purchase_date=COALESCE($3,purchase_date) WHERE id=$4 AND game_id=$5 RETURNING *',[b.status||null,b.purchase_price??null,b.purchase_date||null,params.transactionId,params.id]);return rows.length?NextResponse.json(rows[0]):NextResponse.json({error:'Transaksi tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
export async function DELETE(_:NextRequest,{params}:Context){try{const {rowCount}=await db.query('DELETE FROM transactions WHERE id=$1 AND game_id=$2',[params.transactionId,params.id]);return rowCount?new NextResponse(null,{status:204}):NextResponse.json({error:'Transaksi tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
