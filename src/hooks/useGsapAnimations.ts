'use client';
/**
 * useGsapAnimations.ts
 * Shared GSAP animation hooks untuk seluruh halaman RetroVault.
 * Sudah ada: useHeroAnimation, useScrollAnimations (dashboard)
 * Baru: usePageHeadingAnim, useGridAnim, useDetailAnim, useProfileAnim, useStaggerReveal
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   SHARED: fade + slide up dengan ScrollTrigger
───────────────────────────────────────────── */
function scrollReveal(
  selector: string,
  vars: gsap.TweenVars = {},
  triggerSelector?: string,
  stagger?: number,
) {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (!targets.length) return;
  targets.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 32, ...vars.from } as gsap.TweenVars,
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: stagger ? i * stagger : 0,
        scrollTrigger: {
          trigger: triggerSelector ? (document.querySelector(triggerSelector) ?? el) : el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        ...vars,
      },
    );
  });
}

/* ─────────────────────────────────────────────
   DASHBOARD — HERO
───────────────────────────────────────────── */
export function useHeroAnimation() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-anim-eyebrow',
        { opacity: 0, y: 12, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.16em', duration: 0.7, ease: 'power2.out', delay: 0.1 },
      );

      const words = gsap.utils.toArray<HTMLElement>('.hero-word');
      gsap.fromTo(words,
        { opacity: 0, y: 40, rotateX: -60 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.65, ease: 'back.out(1.4)', stagger: 0.1, delay: 0.4 },
      );

      gsap.fromTo('.hero-anim-desc',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.1 },
      );

      gsap.fromTo('.hero-anim-cta',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)', delay: 1.35 },
      );

      gsap.fromTo('.hero-console',
        { opacity: 0, x: 60, scale: 0.85 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.5 },
      );

      gsap.fromTo('.hero-orbit',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.15, delay: 0.9 },
      );
    });
    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   DASHBOARD — SCROLL SECTIONS
───────────────────────────────────────────── */
export function useScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.highlights-section',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.highlights-section', start: 'top 85%', toggleActions: 'play none none none' } },
      );

      gsap.utils.toArray<HTMLElement>('.section-title').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } },
        );
      });

      gsap.fromTo('.stat-card',
        { opacity: 0, y: 35, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.3)', stagger: 0.1,
          scrollTrigger: { trigger: '.stats-grid', start: 'top 85%', toggleActions: 'play none none none' } },
      );

      gsap.fromTo('.roulette-panel',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.roulette-panel', start: 'top 88%', toggleActions: 'play none none none' } },
      );

      gsap.fromTo('.feature-panel',
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: '.dashboard-lower', start: 'top 88%', toggleActions: 'play none none none' } },
      );

      gsap.fromTo('.quote-panel',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out', delay: 0.1,
          scrollTrigger: { trigger: '.dashboard-lower', start: 'top 88%', toggleActions: 'play none none none' } },
      );
    });
    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   PAGE HEADING — katalog & daftar
───────────────────────────────────────────── */
export function usePageHeadingAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // eyebrow
      gsap.fromTo('.page-heading .eyebrow',
        { opacity: 0, letterSpacing: '0.4em', y: -8 },
        { opacity: 1, letterSpacing: '0.16em', y: 0, duration: 0.6, ease: 'power2.out', delay: 0.05 },
      );
      // h1 heading
      gsap.fromTo('.page-heading h1',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)', delay: 0.2 },
      );
      // muted sub
      gsap.fromTo('.page-heading .muted',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.55 },
      );
      // CTA button
      gsap.fromTo('.page-heading .button-primary',
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)', delay: 0.6 },
      );
    });
    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   GRID CARDS — game-grid / console-grid stagger
───────────────────────────────────────────── */
export function useGridAnim(deps: unknown[] = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.game-card, .console-card');
      if (!cards.length) return;
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: 'back.out(1.3)',
          stagger: { amount: 0.45, from: 'start' },
          delay: 0.1,
        },
      );
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ─────────────────────────────────────────────
   GAME DETAIL PAGE
───────────────────────────────────────────── */
export function useDetailPageAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // back-link
      gsap.fromTo('.back-link',
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 },
      );

      // cover image
      gsap.fromTo('.detail-cover',
        { opacity: 0, scale: 0.93, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.15 },
      );

      // eyebrow
      gsap.fromTo('.detail-copy .eyebrow',
        { opacity: 0, letterSpacing: '0.4em' },
        { opacity: 1, letterSpacing: '0.16em', duration: 0.5, ease: 'power2.out', delay: 0.3 },
      );

      // h1
      gsap.fromTo('.detail-copy h1',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.35 },
      );

      // action buttons
      gsap.fromTo('.detail-copy .button-secondary, .detail-copy .favorite-button, .detail-copy .share-game-button',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.07, delay: 0.65 },
      );

      // description text
      gsap.fromTo('.detail-copy > p',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05, delay: 0.75 },
      );

      // h2 sections on scroll
      gsap.utils.toArray<HTMLElement>('.detail-copy h2').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } },
        );
      });

      // review cards on scroll
      gsap.utils.toArray<HTMLElement>('.review-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' } },
        );
      });
    });
    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   CONSOLE DETAIL PAGE
───────────────────────────────────────────── */
export function useConsoleDetailAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.back-link',
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
      );

      gsap.fromTo('.console-detail-art',
        { opacity: 0, scale: 0.85, rotate: -4 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.65, ease: 'back.out(1.5)', delay: 0.1 },
      );

      gsap.fromTo('.console-detail-head > div',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out', delay: 0.25 },
      );

      scrollReveal('.section-title', {}, undefined, 0);
    });
    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────── */
export function useProfileAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow + rule
      gsap.fromTo('.profile-intro-block .eyebrow',
        { opacity: 0, letterSpacing: '0.5em', y: -10 },
        { opacity: 1, letterSpacing: '0.16em', y: 0, duration: 0.65, ease: 'power2.out', delay: 0.1 },
      );

      // h1 big title — char by char (rendered directly in React JSX)
      gsap.fromTo('.profile-intro-block .pc-char',
        { opacity: 0, y: 30, rotateX: -55, skewX: 8 },
        {
          opacity: 1, y: 0, rotateX: 0, skewX: 0,
          duration: 0.5, ease: 'back.out(1.6)',
          stagger: 0.035, delay: 0.35,
        },
      );

      // intro paragraph
      gsap.fromTo('.profile-intro-block .profile-intro',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.9 },
      );

      // identity card
      gsap.fromTo('.profile-identity',
        { opacity: 0, y: 36, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.profile-identity', start: 'top 88%', toggleActions: 'play none none none' } },
      );

      // portrait
      gsap.fromTo('.profile-portrait',
        { opacity: 0, scale: 0.9, x: -20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.65, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.profile-identity', start: 'top 85%', toggleActions: 'play none none none' },
          delay: 0.1 },
      );

      // identity facts
      gsap.fromTo('.identity-facts div',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.identity-facts', start: 'top 90%', toggleActions: 'play none none none' },
          delay: 0.2 },
      );

      // project section
      gsap.fromTo('.profile-project',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.profile-project', start: 'top 88%', toggleActions: 'play none none none' } },
      );

      // project h2 words (rendered directly in React JSX)
      gsap.fromTo('.profile-project .pp-word',
        { opacity: 0, y: 22, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.5, ease: 'back.out(1.5)', stagger: 0.08,
          scrollTrigger: { trigger: '.profile-project h2', start: 'top 88%', toggleActions: 'play none none none' },
          delay: 0.1,
        },
      );

      // project actions
      gsap.fromTo('.project-actions .profile-cta',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.project-actions', start: 'top 92%', toggleActions: 'play none none none' } },
      );

      // JP watermark bg drift
      gsap.fromTo('.profile-jp-bg',
        { opacity: 0, scale: 0.8, rotate: 10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.profile-identity', start: 'top 85%', toggleActions: 'play none none none' } },
      );

      // JP tagline words cascade
      gsap.fromTo('.project-jp-tagline span',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: '.project-jp-tagline', start: 'top 90%', toggleActions: 'play none none none' } },
      );

      // JP strip scroll
      gsap.fromTo('.project-jp-strip span',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.07,
          scrollTrigger: { trigger: '.project-jp-strip', start: 'top 95%', toggleActions: 'play none none none' } },
      );

      // Manifesto block
      gsap.fromTo('.profile-manifesto',
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.profile-manifesto', start: 'top 90%', toggleActions: 'play none none none' } },
      );

      // Manifesto JP text typewriter effect via clip
      gsap.fromTo('.profile-manifesto p',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.0, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.profile-manifesto', start: 'top 88%', toggleActions: 'play none none none' },
          delay: 0.2 },
      );

      // footer
      gsap.fromTo('.profile-footer',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power1.out',
          scrollTrigger: { trigger: '.profile-footer', start: 'top 95%', toggleActions: 'play none none none' } },
      );
    });
    return () => ctx.revert();
  }, []);
}
