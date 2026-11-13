'use client';

import { FormEvent, useState } from 'react';
import { Star } from 'lucide-react';

type Review = { id: number; game_id: number; rating: number; status_tamat: boolean; review_text: string };

export function ReviewForm({ gameId, onCreated }: { gameId: number; onCreated: (review: Review) => void }) {
  const [rating, setRating] = useState('5');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/games/${gameId}/reviews`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: Number(rating), status_tamat: form.get('status_tamat') === 'on', review_text: String(form.get('review_text') || '').trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ulasan gagal disimpan.');
      onCreated(data); formElement.reset(); setRating('5'); setMessage('Ulasan berhasil ditambahkan.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Ulasan gagal disimpan.'); }
    finally { setBusy(false); }
  }
  return <form className="review-form" onSubmit={submit}>
    <h3>Tulis ulasan</h3>
    <label className="review-rating">Rating
      <span>{[1,2,3,4,5].map(value=><button type="button" key={value} aria-label={`${value} bintang`} aria-pressed={Number(rating)>=value} onClick={()=>setRating(String(value))}><Star size={20} fill={Number(rating)>=value?'currentColor':'none'}/></button>)}</span>
    </label>
    <label className="review-text-label">Catatan<textarea name="review_text" rows={3} placeholder="Apa yang paling kamu ingat dari game ini?"/></label>
    <label className="review-check"><input type="checkbox" name="status_tamat"/> Saya sudah menamatkan game ini</label>
    <button className="button-primary" disabled={busy}>{busy?'Menyimpan…':'Kirim ulasan'}</button>
    {message&&<p className="form-message" role="status">{message}</p>}
  </form>;
}
