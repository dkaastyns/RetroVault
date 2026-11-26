'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Gamepad2, Plus, Search, X } from 'lucide-react';
import type { Console, Game } from '@/lib/types';
import { GameForm } from './GameForm';
import { FavoriteButton } from './FavoriteButton';
import { ShareGameButton } from './ShareGameButton';
import { usePageHeadingAnim, useGridAnim } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

const PAGE_SIZE = 8;

export function GameCatalog({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const [games, setGames] = useState<Game[]>([]);
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [consoleFilter, setConsoleFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const filterRef = useRef<HTMLElement>(null);

  usePageHeadingAnim();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    Promise.all([
      fetch(`/api/games${favoritesOnly ? '?favorites=true' : ''}`).then(async r => {
        if (!r.ok) throw new Error('Gagal memuat katalog');
        return r.json();
      }),
      fetch('/api/consoles').then(async r => {
        if (!r.ok) throw new Error('Gagal memuat konsol');
        return r.json();
      }),
    ])
      .then(([gameRows, consoleRows]) => {
        if (active) { setGames(gameRows); setConsoles(consoleRows); }
      })
      .catch(() => { if (active) setLoadError('Data belum dapat dimuat. Periksa koneksi database lalu coba lagi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [favoritesOnly]);

  // Animate filter bar in after heading
  useEffect(() => {
    if (!filterRef.current) return;
    gsap.fromTo(filterRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.72 },
    );
  }, []);

  const genres = useMemo(() =>
    [...new Set(games.map(g => g.genre).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [games],
  );
  const filteredGames = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('id-ID');
    return games.filter(g => {
      const matchSearch = !q || [g.title, g.genre, g.console_name].some(v => v?.toLocaleLowerCase('id-ID').includes(q));
      return matchSearch && (!consoleFilter || String(g.console_id) === consoleFilter) && (!genreFilter || g.genre === genreFilter);
    });
  }, [games, search, consoleFilter, genreFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const visibleGames = filteredGames.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, consoleFilter, genreFilter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  // Re-animate grid on page / filter change
  useGridAnim([page, search, consoleFilter, genreFilter, loading]);

  const handleFavorite = (id: number, fav: boolean) => {
    if (favoritesOnly && !fav) setGames(p => p.filter(g => g.id !== id));
    else setGames(p => p.map(g => g.id === id ? { ...g, is_favorite: fav } : g));
  };
  const clearFilters = () => { setSearch(''); setConsoleFilter(''); setGenreFilter(''); };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{favoritesOnly ? 'DAFTAR TERSIMPAN' : 'ARSIP PERMAINAN'}</p>
          <h1>{favoritesOnly ? 'Wishlist' : 'Katalog Game'}</h1>
          <p className="muted">{favoritesOnly ? 'Game yang kamu tandai untuk dimainkan atau dikoleksi.' : 'Koleksi klasik yang tersimpan di satu tempat.'}</p>
        </div>
        {!favoritesOnly && (
          <button className="button-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />Tambah game
          </button>
        )}
      </div>

      {showForm && (
        <div
          className="asset-modal-backdrop"
          onKeyDown={e => { if (e.key === 'Escape') setShowForm(false); }}
          onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <section className="asset-modal" role="dialog" aria-modal="true" aria-label="Tambah game">
            <button type="button" className="asset-modal-close" aria-label="Tutup" onClick={() => setShowForm(false)}>×</button>
            <GameForm
              consoles={consoles}
              onCreated={game => { setGames(p => [game as Game, ...p]); setPage(1); setShowForm(false); }}
            />
          </section>
        </div>
      )}

      {!favoritesOnly && (
        <section ref={filterRef} className="catalog-filters" aria-label="Cari dan filter game">
          <label className="catalog-search">
            <Search size={17} />
            <span className="sr-only">Cari game</span>
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul, genre, atau konsol…" />
          </label>
          <label className="catalog-filter">
            <span className="sr-only">Filter konsol</span>
            <select value={consoleFilter} onChange={e => setConsoleFilter(e.target.value)}>
              <option value="">Semua konsol</option>
              {consoles.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
          </label>
          <label className="catalog-filter">
            <span className="sr-only">Filter genre</span>
            <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
              <option value="">Semua genre</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          {(search || consoleFilter || genreFilter) && (
            <button type="button" className="clear-filters" onClick={clearFilters}><X size={14} />Reset</button>
          )}
        </section>
      )}

      <div className="game-grid">
        {loading
          ? <div className="loading-state" role="status"><span className="loading-spinner" />Memuat {favoritesOnly ? 'wishlist' : 'katalog game'}…</div>
          : loadError
            ? <div className="empty-state" role="alert">{loadError}</div>
            : <>
              {visibleGames.map(game => (
                <article
                  className="game-card"
                  key={game.id}
                  onMouseMove={e => {
                    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                    const b = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - b.left) / b.width - 0.5;
                    const y = (e.clientY - b.top) / b.height - 0.5;
                    e.currentTarget.style.setProperty('--tilt-x', `${-y * 7}deg`);
                    e.currentTarget.style.setProperty('--tilt-y', `${x * 7}deg`);
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.removeProperty('--tilt-x');
                    e.currentTarget.style.removeProperty('--tilt-y');
                  }}
                >
                  <Link href={`/games/${game.id}`}>
                    <div className="cover">
                      {game.image_url ? <img loading="lazy" decoding="async" src={game.image_url} alt={game.title} /> : <Gamepad2 size={36} />}
                      <span className="cover-tag">{game.release_year || 'Klasik'}</span>
                    </div>
                    <div className="card-copy">
                      <span className="eyebrow">{game.console_name || 'Konsol'}</span>
                      <h2>{game.title}</h2>
                      <p className="muted">{game.genre}</p>
                    </div>
                  </Link>
                  <FavoriteButton gameId={game.id} initialFavorite={game.is_favorite} compact onChange={fav => handleFavorite(game.id, fav)} />
                  <ShareGameButton gameId={game.id} title={game.title} compact />
                </article>
              ))}
              {filteredGames.length === 0 && (
                <div className="empty-state">
                  {games.length === 0
                    ? (favoritesOnly ? 'Belum ada game favorit. Tekan ikon hati pada game untuk menyimpannya di sini.' : 'Belum ada game. Tambahkan game pertama untuk mulai mengarsipkan koleksi.')
                    : 'Tidak ada game yang cocok. Coba ubah kata pencarian atau filter.'}
                </div>
              )}
            </>
        }
      </div>

      {!loading && !loadError && filteredGames.length > 0 && (
        <nav className="pagination" aria-label="Halaman katalog">
          <span>Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredGames.length)} dari {filteredGames.length} game</span>
          <div>
            <button aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage(v => v - 1)}>
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} aria-current={page === n ? 'page' : undefined} className={page === n ? 'current' : ''} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button aria-label="Halaman berikutnya" disabled={page === totalPages} onClick={() => setPage(v => v + 1)}>
              <ChevronRight size={17} />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
