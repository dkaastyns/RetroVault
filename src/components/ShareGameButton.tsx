'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

export function ShareGameButton({ gameId, title, compact = false }: { gameId: number; title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(`/games/${gameId}`, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Lihat ${title} di RetroVault`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        window.prompt('Salin tautan game ini:', url);
      }
    }
  }

  const Icon = copied ? Check : compact ? Share2 : Copy;
  return <button type="button" className={`share-game-button${compact ? ' compact' : ''}`} onClick={share} aria-label={`Bagikan ${title}`} title={copied ? 'Tautan disalin' : 'Bagikan game'}>
    <Icon size={compact ? 16 : 15}/>{!compact && <span>{copied ? 'Tautan disalin' : 'Bagikan'}</span>}
  </button>;
}
