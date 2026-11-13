import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({name:'RetroVault',short_name:'RetroVault',description:'Arsip koleksi game klasik',start_url:'/',display:'standalone',background_color:'#0b0b12',theme_color:'#0b0b12',icons:[]});}
