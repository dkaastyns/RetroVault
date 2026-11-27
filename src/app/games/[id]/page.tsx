'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Pencil, Trash2, Check, X } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ReviewForm } from '@/components/ReviewForm';
import { ShareGameButton } from '@/components/ShareGameButton';
import { EditGameInfo } from '@/components/EditGameInfo';
import { AssetHistory, AssetTransaction } from '@/components/AssetHistory';
import { useDetailPageAnim } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Review = { id: number; game_id: number; rating: number; status_tamat: boolean; review_text: string };
type Detail = {
  id: number; title: string; genre: string; release_year: number | null; console_name: string;
  manufacturer_name: string; image_url: string | null; images: string[]; description: string | null; is_favorite: boolean; status: 'active'|'draft'|'archived';
  transactions: AssetTransaction[];
  reviews: Review[];
};

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [reviewDraft, setReviewDraft] = useState({rating: 5, review_text: '', status_tamat: false});
  const [reviewMessage, setReviewMessage] = useState('');

  async function saveReview(review: Review) {
    const response = await fetch(`/api/games/${id}/reviews/${review.id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(reviewDraft)});
    const result = await response.json();
    if (!response.ok) { setReviewMessage(result.error || 'Gagal memperbarui ulasan.'); return; }
    setData(cur=>cur?{...cur,reviews:cur.reviews.map(r=>r.id===review.id?result:r)}:cur); setEditingReview(null); setReviewMessage('Ulasan diperbarui.');
  }
  async function deleteReview(review: Review) {
    if (!window.confirm('Hapus ulasan ini?')) return;
    const response = await fetch(`/api/games/${id}/reviews/${review.id}`, {method:'DELETE'});
    if (!response.ok) { setReviewMessage('Gagal menghapus ulasan.'); return; }
    setData(cur=>cur?{...cur,reviews:cur.reviews.filter(r=>r.id!==review.id)}:cur);
  }
  async function changeStatus(status: Detail['status']) {
    const form = new FormData(); form.set('status',status);
    const response = await fetch(`/api/games/${id}`,{method:'PUT',body:form});
    const result = await response.json();
    if(response.ok) setData(cur=>cur?{...cur,status:result.status}:cur);
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/games/${id}`)
      .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(game => { if (active) setData(game); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  // Run GSAP once data is ready
  useDetailPageAnim([data?.id]);

  // Re-trigger review cards if they come after mount
  useEffect(() => {
    if (!data?.reviews.length) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.review-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          },
        );
      });
    });
    return () => ctx.revert();
  }, [data?.reviews]);

  if (loading) return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" />Memuat detail game…
    </div>
  );
  if (error || !data) return (
    <div className="empty-state" role="alert">Detail game belum dapat dimuat. Pastikan database tersedia.</div>
  );

  return (
    <>
      <Link className="back-link" href="/games">
        <ArrowLeft size={16} /> Kembali ke katalog
      </Link>

      <section className="detail-layout">
        {/* Cover */}
        <div className="detail-cover">
          {data.image_url
            ? <img src={data.image_url} alt={data.title} />
            : <div className="cover-placeholder">RETRO<br />VAULT</div>
          }
        </div>
        {(data.images?.length || 0) > 1 && <div className="game-image-gallery" aria-label="Galeri gambar game">{data.images.map((image,index)=><img key={`${image}-${index}`} src={image} alt={`${data.title} ${index+1}`} loading="lazy"/>)}</div>}

        {/* Info */}
        <div className="detail-copy">
          <p className="eyebrow">{data.console_name} · {data.manufacturer_name}</p>
          <h1 style={{ perspective: '500px' }}>{data.title}</h1>

          <EditGameInfo
            gameId={data.id}
            title={data.title}
            genre={data.genre}
            description={data.description}
            onSaved={game => setData(cur => cur ? { ...cur, ...game } : cur)}
          />
          <div className="game-status-control"><span>Status: {data.status==='active'?'Koleksi':data.status==='draft'?'Draft':'Arsip'}</span>{data.status!=='active'&&<button type="button" onClick={()=>changeStatus('active')}>Pindahkan ke koleksi</button>}{data.status!=='draft'&&<button type="button" onClick={()=>changeStatus('draft')}>Jadikan draft</button>}{data.status!=='archived'&&<button type="button" onClick={()=>changeStatus('archived')}>Arsipkan</button>}</div>
          <ShareGameButton gameId={data.id} title={data.title} />
          <FavoriteButton gameId={data.id} initialFavorite={data.is_favorite} />

          <p className="muted">{data.genre} / {data.release_year || 'Tahun tidak diketahui'}</p>
          <p>{data.description || 'Belum ada deskripsi untuk game ini.'}</p>

          <h2>Riwayat aset</h2>
          <AssetHistory
            gameId={data.id}
            transactions={data.transactions}
            onChange={transactions => setData(cur => cur ? { ...cur, transactions } : cur)}
          />

          <h2>
            Ulasan pemain{' '}
            <span className="review-count">{data.reviews.length}</span>
          </h2>

          {data.reviews.map(review => (
            <div className="review-card" key={review.id}>
              {editingReview===review.id ? <>
                <label>Rating <select value={reviewDraft.rating} onChange={e=>setReviewDraft(v=>({...v,rating:Number(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} bintang</option>)}</select></label>
                <textarea value={reviewDraft.review_text} onChange={e=>setReviewDraft(v=>({...v,review_text:e.target.value}))} maxLength={2000}/>
                <label><input type="checkbox" checked={reviewDraft.status_tamat} onChange={e=>setReviewDraft(v=>({...v,status_tamat:e.target.checked}))}/> Sudah tamat</label>
                <button type="button" onClick={()=>saveReview(review)}><Check size={14}/> Simpan</button> <button type="button" onClick={()=>setEditingReview(null)}><X size={14}/> Batal</button>
              </> : <>
              <span className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />
                ))}
              </span>
              <p>{review.review_text || 'Tanpa catatan.'}</p>
              <small>{review.status_tamat ? 'Sudah tamat' : 'Belum tamat'}</small>
              <div className="review-actions"><button type="button" aria-label="Edit ulasan" onClick={()=>{setReviewDraft({rating:review.rating,review_text:review.review_text,status_tamat:review.status_tamat});setEditingReview(review.id)}}><Pencil size={14}/></button><button type="button" aria-label="Hapus ulasan" onClick={()=>deleteReview(review)}><Trash2 size={14}/></button></div>
              </>}
            </div>
          ))}
          {reviewMessage&&<p className="form-message" role="status">{reviewMessage}</p>}

          {data.reviews.length === 0 && (
            <p className="muted">Belum ada ulasan. Jadilah yang pertama berbagi kesan.</p>
          )}

          <ReviewForm
            gameId={data.id}
            onCreated={review => setData(cur => cur ? { ...cur, reviews: [review, ...cur.reviews] } : cur)}
          />
        </div>
      </section>
    </>
  );
}
