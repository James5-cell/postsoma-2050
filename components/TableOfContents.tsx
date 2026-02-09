"use client";

import { useState, useEffect } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(slug);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Container: Fixed Position on Right */}
      <div
        className={`
          fixed right-0 top-32 z-50 flex items-start transition-all duration-500 ease-out
          ${isHovered ? "translate-x-0" : "translate-x-[calc(100%-40px)]"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Trigger Tab (Always Visible) */}
        <div
          className="
          flex h-12 w-10 cursor-pointer items-center justify-center
          rounded-l-lg border-b border-l border-t border-cyan-500/30
          bg-gray-900/80 shadow-[0_0_15px_rgba(0,240,255,0.1)]
          backdrop-blur-md
        "
          aria-label="Open table of contents"
        >
          <svg
            className="h-5 w-5 animate-pulse text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>

        {/* The Content Drawer (Hidden until Hover) */}
        <nav
          className="
          w-72 max-h-[60vh] overflow-y-auto
          border-b border-l border-gray-800 bg-gray-950/90
          p-6 shadow-2xl backdrop-blur-xl
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
                onClick={(e) => handleClick(e, heading.slug)}
                className={`
                  block truncate text-sm transition-all duration-200
                  ${activeId === heading.slug
                    ? "translate-x-1 font-bold text-cyan-400"
                    : "text-gray-500 hover:translate-x-1 hover:text-gray-300"}
                  ${heading.level === 3 ? "pl-4 text-xs opacity-80" : ""}
                `}
              >
                {activeId === heading.slug && (
                  <span className="mr-2 text-cyan-500" aria-hidden>
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
