"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const heroClassName =
  "group relative flex h-full min-h-[200px] w-full flex-col justify-between overflow-hidden rounded border border-[var(--border-subtle)] transition-[box-shadow] sm:min-h-[240px]";

type HeroCellProps = { asChild?: boolean };

export default function HeroCell({ asChild }: HeroCellProps) {
  const accent = CATEGORY_ACCENTS["AI Insights"];
  const content = (
    <>
      <Image
        src="/no-future.jpg"
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
      {/* Heavy black gradient bottom-to-top so text stays readable on light/sepia image */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/50"
        aria-hidden
      />
      {/* Static gradient overlay for subtle decoration */}
      <div
        className="absolute inset-0 mix-blend-screen opacity-40"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, transparent 10%, rgba(0,240,255,0.3) 15%, rgba(0,240,255,0.4) 20%, transparent 25%, transparent 45%, rgba(74,222,128,0.25) 50%, rgba(74,222,128,0.35) 55%, transparent 60%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* Text lower-left so it doesn't cover the face */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-start justify-end pb-8 pl-8 pr-6 pt-6 sm:pb-10 sm:pl-10 sm:pr-8 sm:pt-8">
        <span
          className="font-mono text-xs font-medium uppercase tracking-widest opacity-50"
          style={{ color: accent }}
        >
          PostSoma 2050
        </span>
        <h2 className="hero-title-stroke mt-1.5 font-mono text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Echoes from the Prompt.
        </h2>
        <p className="mt-4 font-sans text-xs font-thin tracking-[0.5em] text-gray-500">
          Step into the Void.
        </p>
      </div>
    </>
  );

  if (asChild) {
    return (
      <div className={heroClassName} style={{ borderColor: accent, boxShadow: `0 0 24px -4px rgba(0,240,255,0.2), 0 0 48px -8px rgba(0,240,255,0.1)` }}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/sheshin-notes"
      className={heroClassName}
      style={{
        borderColor: accent,
        boxShadow: `0 0 24px -4px rgba(0,240,255,0.2), 0 0 48px -8px rgba(0,240,255,0.1)`,
      }}
    >
      {content}
    </Link>
  );
}
