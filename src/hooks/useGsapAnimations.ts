'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow fade in
      gsap.fromTo('.hero-anim-eyebrow', 
        { opacity: 0, y: 12, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.16em', duration: 0.7, ease: 'power2.out', delay: 0.1 }
      );

      // Title words one by one
      const words = gsap.utils.toArray<HTMLElement>('.hero-word');
      gsap.fromTo(words,
        { opacity: 0, y: 40, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          ease: 'back.out(1.4)',
          stagger: 0.1,
          delay: 0.4,
        }
      );

      // Description & CTA slide up
      gsap.fromTo('.hero-anim-desc',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.1 }
      );

      gsap.fromTo('.hero-anim-cta',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)', delay: 1.35 }
      );

      // Hero console glide in from right
      gsap.fromTo('.hero-console',
        { opacity: 0, x: 60, scale: 0.85 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      // Orbit spin on enter
      gsap.fromTo('.hero-orbit',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.15, delay: 0.9 }
      );
    });

    return () => ctx.revert();
  }, []);
}

export function useScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Highlights section
      gsap.fromTo('.highlights-section',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.highlights-section', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      // Section titles
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
          }
        );
      });

      // Stat cards stagger
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 35, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.3)', stagger: 0.1,
          scrollTrigger: { trigger: '.stats-grid', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      // Roulette panel
      gsap.fromTo('.roulette-panel',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.roulette-panel', start: 'top 88%', toggleActions: 'play none none none' }
        }
      );

      // Dashboard lower panels
      gsap.fromTo('.feature-panel',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: '.dashboard-lower', start: 'top 88%', toggleActions: 'play none none none' }
        }
      );

      gsap.fromTo('.quote-panel',
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.65, ease: 'power2.out', delay: 0.1,
          scrollTrigger: { trigger: '.dashboard-lower', start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    return () => ctx.revert();
  }, []);
}
