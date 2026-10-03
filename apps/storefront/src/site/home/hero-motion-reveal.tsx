'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export function HeroMotionReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroMagneticCTA({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    const el = ctaRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const moveX = (x / (rect.width / 2)) * 6;
      const moveY = (y / (rect.height / 2)) * 6;

      gsap.to(el, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ctaRef} className={className}>
      {children}
    </div>
  );
}

interface StillLifeBag {
  id: string;
  num: string;
  name: string;
  shortName: string;
  category: string;
  price: string;
  slug: string;
  image: string;
  // Spatial coordinates for desktop composition
  desktop: {
    className: string;
    widthClass: string;
    aspectRatio: string;
    zIndex: number;
    baseScale: number;
    parallaxMultiplier: number;
    floatDuration: number;
    floatDelay: number;
  };
}

const STILL_LIFE_BAGS: StillLifeBag[] = [
  {
    id: 'bag-maa',
    num: '01',
    name: 'Le Grand Cabas Maa Bolgatanga',
    shortName: 'Grand Cabas Maa',
    category: 'Architecture Tressée',
    price: '185 000 FCFA',
    slug: 'cabas-maa-raphia',
    image: '/images/bags/maa-tote.jpg',
    desktop: {
      className: 'top-1/2 left-1/2 -translate-x-[48%] -translate-y-[48%]',
      widthClass: 'w-[250px] sm:w-[310px] lg:w-[370px]',
      aspectRatio: '1/1',
      zIndex: 10,
      baseScale: 1.0,
      parallaxMultiplier: 0.08,
      floatDuration: 7.2,
      floatDelay: 0,
    },
  },
  {
    id: 'bag-zuri',
    num: '02',
    name: 'La Pochette Bijou Zuri',
    shortName: 'Pochette Zuri',
    category: 'Maroquinerie du Soir',
    price: '95 000 FCFA',
    slug: 'pochette-zuri-laiton',
    image: '/images/bags/zuri-clutch.jpg',
    desktop: {
      className: 'top-1/2 left-[2%] sm:left-[8%] lg:left-[4%] -translate-y-[12%] -rotate-3',
      widthClass: 'w-[160px] sm:w-[200px] lg:w-[230px]',
      aspectRatio: '1/1',
      zIndex: 20,
      baseScale: 0.92,
      parallaxMultiplier: 0.16,
      floatDuration: 6.4,
      floatDelay: 0.5,
    },
  },
  {
    id: 'bag-kemi',
    num: '03',
    name: 'Le Sac Porté Épaule Kemi',
    shortName: 'Sac Épaule Kemi',
    category: 'Cuir & Kente d’Or',
    price: '165 000 FCFA',
    slug: 'porte-epaule-kemi',
    image: '/images/bags/kemi-shoulder.jpg',
    desktop: {
      className: 'top-1/2 right-[2%] sm:right-[6%] lg:right-[3%] -translate-y-[70%] rotate-2',
      widthClass: 'w-[165px] sm:w-[210px] lg:w-[240px]',
      aspectRatio: '1/1',
      zIndex: 15,
      baseScale: 0.90,
      parallaxMultiplier: 0.11,
      floatDuration: 8.0,
      floatDelay: 1.0,
    },
  },
];

export function HeroInteractiveStage({ className = '' }: { className?: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  // Smooth multi-layer GSAP differential parallax on desktop
  useEffect(() => {
    if (!stageRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const stage = stageRef.current;
    const watermark = watermarkRef.current;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = stage.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle counter-parallax on watermark
        if (watermark) {
          gsap.to(watermark, {
            x: -xPct * 20,
            y: -yPct * 12,
            duration: 0.9,
            ease: 'power2.out',
          });
        }

        // Differential parallax on each bag node according to its depth layer
        STILL_LIFE_BAGS.forEach((bag) => {
          const node = document.getElementById(`hero-bag-node-${bag.id}`);
          if (!node) return;
          gsap.to(node, {
            x: xPct * (bag.desktop.parallaxMultiplier * 240),
            y: yPct * (bag.desktop.parallaxMultiplier * 160),
            rotateY: xPct * (bag.desktop.parallaxMultiplier * 60),
            rotateX: -yPct * (bag.desktop.parallaxMultiplier * 45),
            transformPerspective: 1200,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
      };

      const handleMouseLeave = () => {
        if (watermark) {
          gsap.to(watermark, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
        }
        STILL_LIFE_BAGS.forEach((bag) => {
          const node = document.getElementById(`hero-bag-node-${bag.id}`);
          if (!node) return;
          gsap.to(node, {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.4)',
          });
        });
      };

      stage.addEventListener('mousemove', handleMouseMove);
      stage.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        stage.removeEventListener('mousemove', handleMouseMove);
        stage.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative w-full h-[460px] sm:h-[520px] lg:h-[620px] flex items-center justify-center select-none ${className}`}
    >
      {/* ═══ 1. Layer 0: Atmospheric Studio Glow & Watermark (Zero Boxes) ═══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Soft radial warmth blending with #FAF8F5 */}
        <div className="size-[320px] sm:size-[480px] lg:size-[640px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,164,60,0.11)_0%,rgba(166,107,45,0.03)_45%,transparent_72%)] blur-3xl pointer-events-none" />

        {/* Editorial Watermark (breaks behind the bags) */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="font-serif text-[18vw] lg:text-[13vw] font-light uppercase tracking-[0.22em] text-[#1D120A]/[0.035] leading-none whitespace-nowrap translate-y-[-5%]">
            VAKAA
          </span>
        </div>
      </div>

      {/* ═══ 2. The Borderless Still-Life Composition (3 Bags Floating Seamlessly) ═══ */}
      <div className="relative w-full h-full max-w-[580px] lg:max-w-[660px]">
        {STILL_LIFE_BAGS.map((bag) => {
          const isHovered = hoveredId === bag.id;
          const isOtherHovered = hoveredId !== null && !isHovered;

          // Focus pull calculation:
          // Hovered bag scales up gently and sharpens; others dim and soften slightly
          const targetScale = isHovered
            ? bag.desktop.baseScale * 1.05
            : isOtherHovered
            ? bag.desktop.baseScale * 0.96
            : bag.desktop.baseScale;

          const targetOpacity = isHovered ? 1 : isOtherHovered ? 0.68 : 1;
          const targetBlur = isOtherHovered ? 'blur(1px)' : 'blur(0px)';
          const activeZ = isHovered ? 35 : bag.desktop.zIndex;

          return (
            <div
              key={bag.id}
              id={`hero-bag-node-${bag.id}`}
              className={`absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${bag.desktop.className} ${bag.desktop.widthClass}`}
              style={{ zIndex: activeZ }}
              onMouseEnter={() => setHoveredId(bag.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Floating sinusoidal breathing loop */}
              <div
                className="relative w-full flex flex-col items-center cursor-pointer group"
                style={{
                  animation: `hero-float-gentle ${bag.desktop.floatDuration}s ease-in-out infinite`,
                  animationDelay: `${bag.desktop.floatDelay}s`,
                }}
              >
                {/* Direct Link to Product */}
                <Link
                  href={`/product/${bag.slug}`}
                  className="relative block w-full outline-none"
                  aria-label={`Découvrir ${bag.name}`}
                >
                  {/* ── BORDERLESS Image Canvas (Blends 100% seamlessly into #FAF8F5) ── */}
                  <div
                    className="relative w-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      transform: `scale(${targetScale})`,
                      opacity: targetOpacity,
                      filter: targetBlur,
                    }}
                  >
                    {/* The radial mask eliminates all photographic borders, melting ivory background into #FAF8F5 */}
                    <div className="relative aspect-square w-full [mask-image:radial-gradient(ellipse_at_center,black_46%,transparent_76%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_46%,transparent_76%)]">
                      <Image
                        src={bag.image}
                        alt={bag.name}
                        fill
                        priority
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 25vw"
                        className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* ── Dual-Tier Natural Ground Contact Shadow ── */}
                  <div className="w-full flex flex-col items-center -mt-3 pointer-events-none">
                    {/* Layer 1: Umbilical Contact Occlusion */}
                    <div
                      className="w-[62%] h-[5px] bg-[#1D120A]/40 rounded-[50%] blur-[2px] transition-all duration-500"
                      style={{
                        transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                        opacity: isOtherHovered ? 0.25 : 0.45,
                      }}
                    />
                    {/* Layer 2: Diffused Ambient Penumbra */}
                    <div
                      className="w-[88%] h-[16px] bg-[#2A180E]/12 rounded-[50%] blur-[12px] -mt-1 transition-all duration-500"
                      style={{
                        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                        opacity: isOtherHovered ? 0.12 : 0.32,
                      }}
                    />
                  </div>
                </Link>

                {/* ── Whisper Editorial Pin (Subtle, borderless, reveals smoothly) ── */}
                <div
                  className={`mt-2 flex flex-col items-center text-center transition-all duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100 translate-y-0' : isOtherHovered ? 'opacity-20' : 'opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] font-medium text-[#A66B2D]">
                    <span>{bag.num}</span>
                    <span className="w-2.5 h-px bg-[#A66B2D]/40" />
                    <span>{bag.shortName}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[11px] font-semibold tracking-tight text-[#1D120A]">
                      {bag.price}
                    </span>
                    {isHovered && (
                      <ArrowUpRight className="size-3 text-[#A66B2D] animate-fade-in" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
