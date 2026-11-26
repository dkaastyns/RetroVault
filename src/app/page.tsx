'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Dice5, Gamepad2, Layers3, Wallet } from 'lucide-react';
import type { Game } from '@/lib/types';
import { useHeroAnimation, useScrollAnimations } from '@/hooks/useGsapAnimations';

type Stats = { total_games: number; total_consoles: number; asset_value: string; wishlist: number };

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total_games: 0, total_consoles: 0, asset_value: '0', wishlist: 0 });

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  useHeroAnimation();
  useScrollAnimations();

  const cards = [
    { label: 'Total Game', value: stats.total_games, Icon: Gamepad2, href: '/games' },
    { label: 'Konsol', value: stats.total_consoles, Icon: Layers3, href: '/consoles' },
    { label: 'Nilai Aset', value: `Rp ${Number(stats.asset_value).toLocaleString('id-ID')}`, Icon: Wallet, href: '/games' },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow hero-anim-eyebrow">PLAYER ONE, WELCOME BACK</p>
          <h1 style={{ perspective: '600px' }}>
            {/* Line 1 — each word animated individually */}
            {'Kenangan lama,'.split(' ').map((word, i) => (
              <span key={`l1-${i}`} className="hero-word" style={{ marginRight: '0.22em' }}>
                {word}
              </span>
            ))}
            <br />
            {/* Line 2 — accent colored words */}
            <span style={{ color: 'var(--acid)' }}>
              {'tersimpan rapi.'.split(' ').map((word, i) => (
                <span key={`l2-${i}`} className="hero-word" style={{ marginRight: '0.22em' }}>
                  {word}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-anim-desc">
            Arsipkan perjalanan gaming klasikmu: perangkat, game, dan cerita di baliknya.
          </p>
          <Link className="button-primary hero-anim-cta" href="/games">
            Buka koleksi <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="hero-console" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <Gamepad2 size={108} strokeWidth={1} />
          <span>INSERT MEMORY CARD</span>
        </div>
        <div className="hero-index">RV—001 / EST. 2026</div>
      </section>

      <GameHighlights />

      <section className="section-block">
        <div className="section-title">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2>Vault status</h2>
          </div>
          <span className="live-pill">LIVE DATA</span>
        </div>
        <div className="stats-grid">
          {cards.map(({ label, value, Icon, href }) => (
            <Link className="stat-card" href={href} key={label}>
              <div className="stat-top">
                <Icon size={18} />
                <ArrowUpRight size={15} />
              </div>
              <p>{label}</p>
              <strong>{value}</strong>
            </Link>
          ))}
        </div>
        <GameRoulette />
        <div className="dashboard-lower">
          <div className="feature-panel">
            <p className="eyebrow">WISHLIST</p>
            <h3>Berikutnya dalam radar</h3>
            <strong>{stats.wishlist} <small>game di wishlist</small></strong>
            <Link href="/games">Lihat katalog <ArrowUpRight size={15} /></Link>
          </div>
          <div className="quote-panel">
            <span>"</span>
            <p>Setiap game punya cerita. Simpan semuanya di sini.</p>
            <small>RETROVAULT MANIFESTO</small>
          </div>
        </div>
      </section>
    </>
  );
}

function GameHighlights() {
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    let active = true;
    fetch('/api/games')
      .then(response => response.ok ? response.json() : [])
      .then((items: Game[]) => { if (active) setGames(items.filter(game => game.image_url).slice(0, 8)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!games.length) return null;
  return (
    <section className="highlights-section" aria-label="Highlight koleksi game">
      <div className="highlights-heading">
        <div>
          <p className="eyebrow">HIGHLIGHT</p>
          <span className="highlights-tag">TOP PICKS</span>
        </div>
        <Link href="/games">Lihat semua <ArrowUpRight size={14} /></Link>
      </div>
      <div className="highlights-window">
        <div className="highlights-track">
          {[0, 1].map(copy => (
            <div className="highlights-group" key={copy} aria-hidden={copy === 1}>
              {games.map(game => (
                <Link
                  className="highlight-card"
                  href={`/games/${game.id}`}
                  key={`${copy}-${game.id}`}
                  tabIndex={copy === 1 ? -1 : undefined}
                >
                  <img src={game.image_url!} alt={copy === 0 ? game.title : ''} loading="lazy" decoding="async" />
                  <span className="highlight-shade" />
                  <span className="highlight-copy">
                    <small>{game.console_name || 'RETROVAULT PICK'}</small>
                    <strong>{game.title}</strong>
                    <em>{game.release_year || 'CLASSIC'} · {game.genre}</em>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GameRoulette() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function pickGame() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error();
      const games: Game[] = await response.json();
      if (!games.length) { setGame(null); setMessage('Koleksimu masih kosong. Tambahkan game dulu!'); return; }
      setGame(games[Math.floor(Math.random() * games.length)]);
    } catch {
      setMessage('Game belum bisa diundi. Coba lagi sebentar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="roulette-panel" aria-labelledby="roulette-title">
      <div className="roulette-heading">
        <div>
          <p className="eyebrow">PILIHAN RANDOM</p>
          <h3 id="roulette-title">Mau main apa hari ini?</h3>
        </div>
        <button className="roulette-button" type="button" onClick={pickGame} disabled={loading}>
          <Dice5 size={17} />{loading ? 'Mengundi…' : 'Putar roulette'}
        </button>
      </div>
      {game ? (
        <Link className="roulette-result" href={`/games/${game.id}`}>
          <span className="roulette-icon"><Gamepad2 size={20} /></span>
          <span>
            <small>GAME PILIHANMU</small>
            <strong>{game.title}</strong>
            <em>{game.console_name || 'Koleksi RetroVault'} · {game.genre}</em>
          </span>
          <ArrowUpRight size={18} />
        </Link>
      ) : (
        <p className="roulette-hint" aria-live="polite">{message || 'Undi game acak dari koleksimu dan mulai nostalgia.'}</p>
      )}
    </section>
  );
}
