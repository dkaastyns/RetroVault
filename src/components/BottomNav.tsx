'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Gamepad2, Heart, Home, Layers3, UserRound } from 'lucide-react';
const links=[{href:'/',label:'Beranda',Icon:Home},{href:'/games',label:'Game',Icon:Gamepad2},{href:'/wishlist',label:'Favorit',Icon:Heart},{href:'/consoles',label:'Konsol',Icon:Layers3},{href:'/profile',label:'Profil',Icon:UserRound}];
export function BottomNav(){
  const path=usePathname();
  const [scrolled,setScrolled]=useState(false);
  const [indicator,setIndicator]=useState({left:0,width:0,ready:false});
  const navRef=useRef<HTMLElement>(null);
  const linkRefs=useRef<(HTMLAnchorElement|null)[]>([]);
  const activeIndex=links.findIndex(link=>path===link.href||(link.href!=='/'&&path.startsWith(`${link.href}/`)));

  useEffect(()=>{const update=()=>setScrolled(window.scrollY>48);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);

  useLayoutEffect(()=>{
    const nav=navRef.current;
    const activeLink=linkRefs.current[activeIndex];
    if(!nav||!activeLink)return;
    const update=()=>{
      const navBounds=nav.getBoundingClientRect();
      const linkBounds=activeLink.getBoundingClientRect();
      setIndicator({left:linkBounds.left-navBounds.left,width:linkBounds.width,ready:true});
    };
    update();
    const observer=new ResizeObserver(update);
    observer.observe(nav);
    return()=>observer.disconnect();
  },[activeIndex,path]);

  return <nav ref={navRef} aria-label="Navigasi utama" className={`bottom-nav${scrolled?' scrolled':''}`}>
    <span aria-hidden="true" className={`nav-indicator${indicator.ready?' ready':''}`} style={{width:indicator.width,transform:`translateX(${indicator.left}px)`}} />
    {links.map(({href,label,Icon},index)=><Link ref={element=>{linkRefs.current[index]=element}} aria-current={activeIndex===index?'page':undefined} className={activeIndex===index?'nav-link active':'nav-link'} href={href} key={href}><Icon size={18}/><span>{label}</span></Link>)}
  </nav>;
}
