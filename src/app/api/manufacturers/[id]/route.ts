import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
type Context={params:{id:string}};
export async function GET(_:NextRequest,{params}:Context){try{const {rows}=await db.query('SELECT * FROM manufacturers WHERE id=$1',[params.id]);return rows.length?NextResponse.json(rows[0]):NextResponse.json({error:'Pabrikan tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
export async function PUT(req:NextRequest,{params}:Context){try{const b=await req.json();const {rows}=await db.query('UPDATE manufacturers SET name=COALESCE($1,name),country=COALESCE($2,country),founded_year=COALESCE($3,founded_year) WHERE id=$4 RETURNING *',[b.name||null,b.country||null,b.founded_year??null,params.id]);return rows.length?NextResponse.json(rows[0]):NextResponse.json({error:'Pabrikan tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
export async function DELETE(_:NextRequest,{params}:Context){try{const {rowCount}=await db.query('DELETE FROM manufacturers WHERE id=$1',[params.id]);return rowCount?new NextResponse(null,{status:204}):NextResponse.json({error:'Pabrikan tidak ditemukan'},{status:404});}catch(e){return errorResponse(e);}}
