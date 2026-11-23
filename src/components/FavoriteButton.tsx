'use client';

import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from './Toast';

export function FavoriteButton({ gameId, initialFavorite, onChange, compact = false }: {
  gameId: number; initialFavorite: boolean; onChange?: (favorite: boolean) => void; compact?: boolean;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation();
    if (busy) return;
    const next = !favorite;
    setFavorite(next);
    setBusy(true);
    onChange?.(next);

    // Burst particle animation
    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }

    try {
      const response = await fetch(`/api/games/${gameId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: next }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan favorit');
      toast(next ? '❤️ Ditambahkan ke favorit!' : 'Dihapus dari favorit', next ? 'success' : 'info');
    } catch {
      setFavorite(!next);
      onChange?.(!next);
      toast('Gagal menyimpan favorit', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={`favorite-button${favorite ? ' is-favorite' : ''}${compact ? ' compact' : ''}${burst ? ' fav-burst' : ''}`}
      aria-label={favorite ? 'Hapus dari favorit' : 'Tambahkan ke favorit'}
      aria-pressed={favorite}
      onClick={toggle}
      disabled={busy}
    >
      <span className="fav-heart-wrap">
        <Heart size={compact ? 17 : 19} fill={favorite ? 'currentColor' : 'none'} />
        {burst && (
          <span className="fav-particles" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="fav-particle" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </span>
        )}
      </span>
      {!compact && <span>{favorite ? 'Favorit' : 'Favoritkan'}</span>}
    </button>
  );
}
