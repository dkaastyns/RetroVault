import type { Metadata, Viewport } from 'next';
import './globals.css';
import './polish.css';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorker } from '@/components/ServiceWorker';
export const metadata:Metadata={title:'RetroVault — Arsip game klasik',description:'Katalog dan pengelola koleksi game konsol klasik.',manifest:'/manifest.json',applicationName:'RetroVault'};
export const viewport:Viewport={themeColor:'#0b0b12',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><ServiceWorker/><header className="topbar"><a href="/" className="brand"><span className="brand-mark">R</span> RETRO<span>VAULT</span></a><span className="topbar-note">COLLECTION OS <i/></span></header><main className="shell">{children}</main><BottomNav/></body></html>}
