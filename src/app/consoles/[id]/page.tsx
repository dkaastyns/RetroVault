'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import type { Game } from '@/lib/types';
import { useConsoleDetailAnim, useGridAnim } from '@/hooks/useGsapAnimations';

type ConsoleDetail = {
  name: string;
  manufacturer_name: string;
  release_year: number;
  image_url: string | null;
  games: Game[];
};

export default function ConsoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ConsoleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/consoles/${id}`)
      .then(async r => { if (r.ok) setItem(await r.json()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useConsoleDetailAnim([item?.name]);
  useGridAnim([item]);

  if (loading) return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" />Memuat detail konsol…
    </div>
  );
  if (!item) return (
    <div className="empty-state" role="alert">Konsol tidak ditemukan.</div>
  );

  return (
    <>
      <Link className="back-link" href="/consoles">
        <ArrowLeft size={16} /> Kembali ke konsol
      </Link>

      <section className="console-detail-head">
        <div className="console-detail-art">
          {item.image_url
            ? <img src={item.image_url} alt={item.name} />
            : <Gamepad2 size={56} />}
        </div>
        <div>
          <p className="eyebrow">{item.manufacturer_name}</p>
          <h1>{item.name}</h1>
          <p className="muted">
            Dirilis {item.release_year || '—'} · {item.games.length} game terarsip
          </p>
        </div>
      </section>

      <div className="section-title">
        <div>
          <p className="eyebrow">LIBRARY</p>
          <h2>Game untuk konsol ini</h2>
        </div>
      </div>

      <div className="game-grid">
        {item.games.map(game => (
          <Link className="game-card" href={`/games/${game.id}`} key={game.id}>
            <div className="cover">
              {game.image_url
                ? <img src={game.image_url} alt={game.title} />
                : <Gamepad2 size={34} />}
            </div>
            <div className="card-copy">
              <span className="eyebrow">{game.release_year || 'Klasik'}</span>
              <h2>{game.title}</h2>
              <p className="muted">{game.genre}</p>
            </div>
          </Link>
        ))}
        {item.games.length === 0 && (
          <div className="empty-state">Belum ada game untuk konsol ini.</div>
        )}
      </div>
    </>
  );
}
