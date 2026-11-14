'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Gamepad2, Plus, Search, X } from 'lucide-react';
import type { Console, Game } from '@/lib/types';
import { GameForm } from './GameForm';
import { FavoriteButton } from './FavoriteButton';
import { ShareGameButton } from './ShareGameButton';

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

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    Promise.all([
      fetch(`/api/games${favoritesOnly ? '?favorites=true' : ''}`).then(async response => {
        if (!response.ok) throw new Error('Gagal memuat katalog');
        return response.json();
      }),
      fetch('/api/consoles').then(async response => {
        if (!response.ok) throw new Error('Gagal memuat konsol');
        return response.json();
      }),
    ]).then(([gameRows, consoleRows]) => {
      if (active) {
        setGames(gameRows);
        setConsoles(consoleRows);
      }
    }).catch(() => {
      if (active) setLoadError('Data belum dapat dimuat. Periksa koneksi database lalu coba lagi.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [favoritesOnly]);

  const genres = useMemo(() => [...new Set(games.map(game => game.genre).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [games]);
  const filteredGames = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id-ID');
    return games.filter(game => {
      const matchesSearch = !query || [game.title, game.genre, game.console_name].some(value => value?.toLocaleLowerCase('id-ID').includes(query));
      return matchesSearch && (!consoleFilter || String(game.console_id) === consoleFilter) && (!genreFilter || game.genre === genreFilter);
    });
  }, [games, search, consoleFilter, genreFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const visibleGames = filteredGames.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, consoleFilter, genreFilter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const handleFavorite = (id: number, favorite: boolean) => {
    if (favoritesOnly && !favorite) setGames(previous => previous.filter(game => game.id !== id));
    else setGames(previous => previous.map(game => game.id === id ? { ...game, is_favorite: favorite } : game));
  };
  const clearFilters = () => { setSearch(''); setConsoleFilter(''); setGenreFilter(''); };

  return <>
    <div className="page-heading">
      <div>
        <p className="eyebrow">{favoritesOnly ? 'DAFTAR TERSIMPAN' : 'ARSIP PERMAINAN'}</p>
        <h1>{favoritesOnly ? 'Wishlist' : 'Katalog Game'}</h1>
        <p className="muted">{favoritesOnly ? 'Game yang kamu tandai untuk dimainkan atau dikoleksi.' : 'Koleksi klasik yang tersimpan di satu tempat.'}</p>
      </div>
      {!favoritesOnly && <button className="button-primary" onClick={() => setShowForm(!showForm)}><Plus size={16}/>{showForm ? 'Tutup' : 'Tambah game'}</button>}
    </div>

    {showForm && <GameForm consoles={consoles} onCreated={game => { setGames(previous => [game as Game, ...previous]); setPage(1); }}/>}

    {!favoritesOnly && <section className="catalog-filters" aria-label="Cari dan filter game">
      <label className="catalog-search"><Search size={17}/><span className="sr-only">Cari game</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari judul, genre, atau konsol…"/></label>
      <label className="catalog-filter"><span className="sr-only">Filter konsol</span><select value={consoleFilter} onChange={event => setConsoleFilter(event.target.value)}><option value="">Semua konsol</option>{consoles.map(console => <option key={console.id} value={String(console.id)}>{console.name}</option>)}</select></label>
      <label className="catalog-filter"><span className="sr-only">Filter genre</span><select value={genreFilter} onChange={event => setGenreFilter(event.target.value)}><option value="">Semua genre</option>{genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}</select></label>
      {(search || consoleFilter || genreFilter) && <button type="button" className="clear-filters" onClick={clearFilters}><X size={14}/>Reset</button>}
    </section>}

    <div className="game-grid">
      {loading ? <div className="loading-state" role="status"><span className="loading-spinner"/>Memuat {favoritesOnly ? 'wishlist' : 'katalog game'}…</div>
        : loadError ? <div className="empty-state" role="alert">{loadError}</div>
        : <>
          {visibleGames.map(game => <article className="game-card" key={game.id}
            onMouseMove={event => {
              if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - .5;
              const y = (event.clientY - bounds.top) / bounds.height - .5;
              event.currentTarget.style.setProperty('--tilt-x', `${-y * 7}deg`);
              event.currentTarget.style.setProperty('--tilt-y', `${x * 7}deg`);
            }}
            onMouseLeave={event => { event.currentTarget.style.removeProperty('--tilt-x'); event.currentTarget.style.removeProperty('--tilt-y'); }}>
            <Link href={`/games/${game.id}`}>
              <div className="cover">{game.image_url ? <img loading="lazy" decoding="async" src={game.image_url} alt={game.title}/> : <Gamepad2 size={36}/>}<span className="cover-tag">{game.release_year || 'Klasik'}</span></div>
              <div className="card-copy"><span className="eyebrow">{game.console_name || 'Konsol'}</span><h2>{game.title}</h2><p className="muted">{game.genre}</p></div>
            </Link>
            <FavoriteButton gameId={game.id} initialFavorite={game.is_favorite} compact onChange={favorite => handleFavorite(game.id, favorite)}/>
            <ShareGameButton gameId={game.id} title={game.title} compact/>
          </article>)}
          {filteredGames.length === 0 && <div className="empty-state">{games.length === 0 ? (favoritesOnly ? 'Belum ada game favorit. Tekan ikon hati pada game untuk menyimpannya di sini.' : 'Belum ada game. Tambahkan game pertama untuk mulai mengarsipkan koleksi.') : 'Tidak ada game yang cocok. Coba ubah kata pencarian atau filter.'}</div>}
        </>}
    </div>

    {!loading && !loadError && filteredGames.length > 0 && <nav className="pagination" aria-label="Halaman katalog">
      <span>Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredGames.length)} dari {filteredGames.length} game</span>
      <div><button aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={17}/></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button key={number} aria-current={page === number ? 'page' : undefined} className={page === number ? 'current' : ''} onClick={() => setPage(number)}>{number}</button>)}
        <button aria-label="Halaman berikutnya" disabled={page === totalPages} onClick={() => setPage(value => value + 1)}><ChevronRight size={17}/></button>
      </div>
    </nav>}
  </>;
}
