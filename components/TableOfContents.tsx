"use client";

import { useState, useEffect, useCallback } from "react";

export type Heading = {
  text: string;
  level: number;
  slug: string;
};

export default function TableOfContents({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState<string>("");
  // Single source of truth: isOpen controls drawer visibility
  const [isOpen, setIsOpen] = useState(false);
  // Track if opened via click (to prevent hover-close overriding click)
  const [isClickLocked, setIsClickLocked] = useState(false);

  // --- Scroll Spy Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  // Detect if user is on a touch/mobile device
  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }, []);

  // Toggle drawer on click/tap
  const handleTabClick = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      setIsClickLocked(next); // Lock open state if opening via click
      return next;
    });
  }, []);

  // Handle keyboard accessibility (Enter/Space)
  const handleTabKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTabClick();
    }
  }, [handleTabClick]);

  // Open on hover (desktop only, unless click-locked open)
  const handleMouseEnter = useCallback(() => {
    if (!isClickLocked) {
      setIsOpen(true);
    }
  }, [isClickLocked]);

  // Close on mouse leave (desktop only, unless click-locked)
  const handleMouseLeave = useCallback(() => {
    if (!isClickLocked) {
      setIsOpen(false);
    }
  }, [isClickLocked]);

  // Handle heading click - navigate and optionally close on mobile
  const handleHeadingClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveId(slug);
      }
      // Auto-close drawer on mobile for better UX
      if (isMobile()) {
        setIsOpen(false);
        setIsClickLocked(false);
      }
    },
    [isMobile]
  );

  if (headings.length === 0) return null;

  return (
    <>
      {/* Container: Fixed Position on Right */}
      <div
        className={`
          fixed right-0 top-32 z-50 flex items-start transition-all duration-500 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-[calc(100%-40px)]"}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* The Trigger Tab (Always Visible) - Now a proper button for accessibility */}
        <button
          type="button"
          onClick={handleTabClick}
          onKeyDown={handleTabKeyDown}
          className="
            flex h-12 w-10 cursor-pointer items-center justify-center
            rounded-l-lg border-b border-l border-t border-cyan-500/30
            bg-gray-900/80 shadow-[0_0_15px_rgba(0,240,255,0.1)]
            backdrop-blur-md
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900
            active:scale-95 transition-transform
          "
          aria-label={isOpen ? "Close table of contents" : "Open table of contents"}
          aria-expanded={isOpen}
          aria-controls="neural-index-drawer"
        >
          <svg
            className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "animate-pulse"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>

        {/* The Content Drawer */}
        <nav
          id="neural-index-drawer"
          className="
            w-72 max-w-[calc(100vw-60px)] max-h-[60vh] overflow-y-auto
            border-b border-l border-gray-800 bg-gray-950/90
            p-6 shadow-2xl backdrop-blur-xl
            sm:w-72
          "
        >
          <h4 className="mb-6 border-b border-gray-800 pb-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            // Neural Index
          </h4>

          <div className="flex flex-col space-y-3">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.slug}`}
                onClick={(e) => handleHeadingClick(e, heading.slug)}
                className={`
                  block truncate text-sm transition-all duration-200
                  ${activeId === heading.slug
                    ? "translate-x-1 font-bold text-cyan-400"
                    : "text-gray-500 hover:translate-x-1 hover:text-gray-300"}
                  ${heading.level === 3 ? "pl-4 text-xs opacity-80" : ""}
                `}
              >
                {activeId === heading.slug && (
                  <span className="mr-2 text-cyan-500" aria-hidden="true">
                    ›
                  </span>
                )}
                {heading.text}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
