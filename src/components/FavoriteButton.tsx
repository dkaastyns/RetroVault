'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export function FavoriteButton({ gameId, initialFavorite, onChange, compact = false }: {
  gameId: number; initialFavorite: boolean; onChange?: (favorite: boolean) => void; compact?: boolean;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);
  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation();
    if (busy) return;
    const next = !favorite; setFavorite(next); setBusy(true); onChange?.(next);
    try {
      const response = await fetch(`/api/games/${gameId}/favorite`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_favorite: next }) });
      if (!response.ok) throw new Error('Gagal menyimpan favorit');
    } catch { setFavorite(!next); onChange?.(!next); }
    finally { setBusy(false); }
  }
  return <button type="button" className={`favorite-button${favorite ? ' is-favorite' : ''}${compact ? ' compact' : ''}`} aria-label={favorite ? 'Hapus dari favorit' : 'Tambahkan ke favorit'} aria-pressed={favorite} onClick={toggle} disabled={busy}><Heart size={compact ? 17 : 19} fill={favorite ? 'currentColor' : 'none'}/>{!compact&&<span>{favorite?'Favorit':'Favoritkan'}</span>}</button>;
}
