'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ReviewForm } from '@/components/ReviewForm';
import { ShareGameButton } from '@/components/ShareGameButton';
import { EditGameInfo } from '@/components/EditGameInfo';

type Review = { id: number; game_id: number; rating: number; status_tamat: boolean; review_text: string };
type Detail = {
  id: number; title: string; genre: string; release_year: number | null; console_name: string;
  manufacturer_name: string; image_url: string | null; description: string | null; is_favorite: boolean;
  transactions: { id: number; status: string; purchase_price: string; purchase_date: string | null }[];
  reviews: Review[];
};

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/games/${id}`).then(async response => {
      if (!response.ok) throw new Error('Game tidak ditemukan');
      return response.json();
    }).then(game => { if (active) setData(game); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="loading-state"><span className="loading-spinner"/>Memuat detail game…</div>;
  if (error || !data) return <div className="empty-state" role="alert">Detail game belum dapat dimuat. Pastikan database tersedia.</div>;

  return <>
    <Link className="back-link" href="/games"><ArrowLeft size={16}/> Kembali ke katalog</Link>
    <section className="detail-layout">
      <div className="detail-cover">{data.image_url ? <img src={data.image_url} alt={data.title}/> : <div className="cover-placeholder">RETRO<br/>VAULT</div>}</div>
      <div className="detail-copy">
        <p className="eyebrow">{data.console_name} · {data.manufacturer_name}</p>
        <h1>{data.title}</h1>
        <EditGameInfo gameId={data.id} description={data.description} onSaved={game => setData(current => current ? { ...current, ...game } : current)} />
        <ShareGameButton gameId={data.id} title={data.title}/>
        <FavoriteButton gameId={data.id} initialFavorite={data.is_favorite}/>
        <p className="muted">{data.genre} / {data.release_year || 'Tahun tidak diketahui'}</p>
        <p>{data.description || 'Belum ada deskripsi untuk game ini.'}</p>
        <h2>Riwayat aset</h2>
        {data.transactions.map(transaction => <div className="list-row" key={transaction.id}><span>{transaction.status}</span><strong>Rp {Number(transaction.purchase_price).toLocaleString('id-ID')}</strong><small>{transaction.purchase_date || '—'}</small></div>)}
        {data.transactions.length === 0 && <p className="muted">Belum ada transaksi.</p>}
        <h2>Ulasan pemain <span className="review-count">{data.reviews.length}</span></h2>
        {data.reviews.map(review => <div className="review-card" key={review.id}><span className="stars">{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={14} fill="currentColor"/>)}</span><p>{review.review_text || 'Tanpa catatan.'}</p><small>{review.status_tamat ? 'Sudah tamat' : 'Belum tamat'}</small></div>)}
        {data.reviews.length === 0 && <p className="muted">Belum ada ulasan. Jadilah yang pertama berbagi kesan.</p>}
        <ReviewForm gameId={data.id} onCreated={review => setData(current => current ? { ...current, reviews: [review, ...current.reviews] } : current)}/>
      </div>
    </section>
  </>;
}
