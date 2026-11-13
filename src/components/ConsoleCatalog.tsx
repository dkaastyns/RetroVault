'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { Layers3 } from 'lucide-react';
import type { Console } from '@/lib/types';
export function ConsoleCatalog(){const [items,setItems]=useState<Console[]>([]);useEffect(()=>{fetch('/api/consoles').then(r=>r.json()).then(setItems).catch(()=>{});},[]);return <><div className="page-heading"><div><p className="eyebrow">HARDWARE</p><h1>Daftar Konsol</h1><p className="muted">Jelajahi perangkat dan pabrikan di balik koleksi.</p></div></div><div className="console-grid">{items.map(c=><Link className="console-card" href={`/consoles/${c.id}`} key={c.id}><div className="console-art">{c.image_url?<img loading="lazy" decoding="async" src={c.image_url} alt={c.name}/>:<Layers3 size={38}/>}</div><span className="eyebrow">{c.manufacturer_name}</span><h2>{c.name}</h2><p className="muted">{c.release_year||'—'} · {c.game_count||0} game</p></Link>)}{items.length===0&&<div className="empty-state">Belum ada konsol. Tambahkan data melalui endpoint <code>POST /api/consoles</code>.</div>}</div></>}
