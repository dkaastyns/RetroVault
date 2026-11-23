'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
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
  manufacturer_name: string; image_url: string | null; description: string | null; is_favorite: boolean;
  transactions: AssetTransaction[];
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
    fetch(`/api/games/${id}`)
      .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(game => { if (active) setData(game); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  // Run GSAP once data is ready
  useDetailPageAnim();

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
      <Link className="back-link" href="/games" style={{ opacity: 0 }}>
        <ArrowLeft size={16} /> Kembali ke katalog
      </Link>

      <section className="detail-layout">
        {/* Cover */}
        <div className="detail-cover" style={{ opacity: 0 }}>
          {data.image_url
            ? <img src={data.image_url} alt={data.title} />
            : <div className="cover-placeholder">RETRO<br />VAULT</div>
          }
        </div>

        {/* Info */}
        <div className="detail-copy">
          <p className="eyebrow" style={{ opacity: 0 }}>{data.console_name} · {data.manufacturer_name}</p>
          <h1 style={{ perspective: '500px' }}>{data.title}</h1>

          <EditGameInfo
            gameId={data.id}
            description={data.description}
            onSaved={game => setData(cur => cur ? { ...cur, ...game } : cur)}
          />
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
              <span className="stars">
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
              <p>{review.review_text || 'Tanpa catatan.'}</p>
              <small>{review.status_tamat ? 'Sudah tamat' : 'Belum tamat'}</small>
            </div>
          ))}

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
