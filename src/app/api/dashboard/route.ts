import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { errorResponse } from '@/lib/http';
export async function GET(){try{const [games,consoles,value,wishlist]=await Promise.all([db.query('SELECT COUNT(*)::int AS total FROM games'),db.query('SELECT COUNT(*)::int AS total FROM consoles'),db.query("SELECT COALESCE(SUM(purchase_price),0)::numeric AS total FROM transactions WHERE status='Koleksi'"),db.query("SELECT COUNT(*)::int AS total FROM transactions WHERE status='Wishlist'")]);return NextResponse.json({total_games:games.rows[0].total,total_consoles:consoles.rows[0].total,asset_value:value.rows[0].total,wishlist:wishlist.rows[0].total});}catch(e){return errorResponse(e);}}
