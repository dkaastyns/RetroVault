'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Plus } from 'lucide-react';
import type { Console, Game } from '@/lib/types';
import { GameForm } from './GameForm';
export function GameCatalog(){const [games,setGames]=useState<Game[]>([]);const [consoles,setConsoles]=useState<Console[]>([]);const [showForm,setShowForm]=useState(false);
 useEffect(()=>{Promise.all([fetch('/api/games').then(r=>r.json()),fetch('/api/consoles').then(r=>r.json())]).then(([g,c])=>{setGames(g);setConsoles(c)}).catch(()=>{});},[]);
 return <><div className="page-heading"><div><p className="eyebrow">ARSIP PERMAINAN</p><h1>Katalog Game</h1><p className="muted">Koleksi klasik yang tersimpan di satu tempat.</p></div><button className="button-primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/>{showForm?'Tutup':'Tambah game'}</button></div>{showForm&&<GameForm consoles={consoles} onCreated={g=>setGames(prev=>[g as Game,...prev])}/>}<div className="game-grid">{games.map(game=><Link className="game-card" href={`/games/${game.id}`} key={game.id}><div className="cover">{game.image_url?<img loading="lazy" decoding="async" src={game.image_url} alt={game.title}/>:<Gamepad2 size={36}/>}<span className="cover-tag">{game.release_year||'Klasik'}</span></div><div className="card-copy"><span className="eyebrow">{game.console_name||'Konsol'}</span><h2>{game.title}</h2><p className="muted">{game.genre}</p></div></Link>)}{games.length===0&&<div className="empty-state">Belum ada game. Tambahkan game pertama untuk mulai mengarsipkan koleksi.</div>}</div></>;
}
