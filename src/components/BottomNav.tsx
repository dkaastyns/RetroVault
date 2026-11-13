'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Gamepad2, Heart, Home, Layers3, UserRound } from 'lucide-react';
const links=[{href:'/',label:'Beranda',Icon:Home},{href:'/games',label:'Game',Icon:Gamepad2},{href:'/wishlist',label:'Favorit',Icon:Heart},{href:'/consoles',label:'Konsol',Icon:Layers3},{href:'/profile',label:'Profil',Icon:UserRound}];
export function BottomNav(){const path=usePathname();const [scrolled,setScrolled]=useState(false);useEffect(()=>{const update=()=>setScrolled(window.scrollY>48);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);return <nav aria-label="Navigasi utama" className={`bottom-nav${scrolled?' scrolled':''}`}>{links.map(({href,label,Icon})=><Link aria-current={path===href?'page':undefined} className={path===href?'nav-link active':'nav-link'} href={href} key={href}><Icon size={18}/><span>{label}</span></Link>)}</nav>}
