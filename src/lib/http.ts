import { NextResponse } from 'next/server';
export function errorResponse(error: unknown) {
  console.error(error);
  return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
}
