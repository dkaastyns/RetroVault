import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
export async function GET(){try{const {rows}=await db.query('SELECT * FROM manufacturers ORDER BY name');return NextResponse.json(rows);}catch(e){return errorResponse(e);}}
export async function POST(req:NextRequest){try{const body=await req.json();if(!body.name||!body.country)return NextResponse.json({error:'name dan country wajib diisi'},{status:400});const {rows}=await db.query('INSERT INTO manufacturers(name,country,founded_year) VALUES($1,$2,$3) RETURNING *',[body.name,body.country,body.founded_year||null]);return NextResponse.json(rows[0],{status:201});}catch(e){return errorResponse(e);}}
