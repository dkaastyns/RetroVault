import type { Metadata, Viewport } from 'next';
import './globals.css';
import './polish.css';
import './pwa.css';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorker } from '@/components/ServiceWorker';
import { PwaExperience } from '@/components/PwaExperience';
export const metadata:Metadata={title:'RetroVault — Arsip game klasik',description:'Katalog dan pengelola koleksi game konsol klasik.',manifest:'/manifest.json',applicationName:'RetroVault',appleWebApp:{capable:true,title:'RetroVault',statusBarStyle:'black-translucent'},icons:{icon:[{url:'/icons/retrovault-192.svg',type:'image/svg+xml'}],apple:'/icons/retrovault-192.svg'}};
export const viewport:Viewport={themeColor:'#0b0b12',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><ServiceWorker/><PwaExperience/><header className="topbar"><a href="/" className="brand"><span className="brand-mark">R</span> RETRO<span>VAULT</span></a><span className="topbar-note">COLLECTION OS <i/></span></header><main className="shell">{children}</main><BottomNav/></body></html>}
