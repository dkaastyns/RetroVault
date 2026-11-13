'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Home, Layers3, UserRound } from 'lucide-react';
const links=[{href:'/',label:'Beranda',Icon:Home},{href:'/games',label:'Game',Icon:Gamepad2},{href:'/consoles',label:'Konsol',Icon:Layers3},{href:'/profile',label:'Profil',Icon:UserRound}];
export function BottomNav(){const path=usePathname();return <nav className="bottom-nav">{links.map(({href,label,Icon})=><Link aria-current={path===href?'page':undefined} className={path===href?'nav-link active':'nav-link'} href={href} key={href}><Icon size={19}/><span>{label}</span></Link>)}</nav>}
