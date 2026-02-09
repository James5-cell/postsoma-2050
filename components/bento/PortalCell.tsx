"use client";

import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const STATUS_ITEMS = [
    { tag: "OPS", value: "GREEN", valueClass: "text-emerald-400" },
    { tag: "HEAT", value: "LOW", valueClass: "text-cyan-400" },
    { tag: "SIGNAL", value: "CLEAN", valueClass: "text-cyan-400" },
];

export default function PortalCell() {
    const accent = CATEGORY_ACCENTS["AI Insights"]; // Cyan accent

    return (
        <a
            href="https://postsoma-2050.website"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Armory (postsoma-2050.website)"
            className="portal-card group relative flex min-h-[120px] flex-col justify-between rounded border border-cyan-400 bg-neutral-900 p-5 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-300 hover:animate-portal-breath hover:shadow-[0_0_28px_rgba(0,240,255,0.5)] active:shadow-[0_0_40px_rgba(0,240,255,0.7)] active:border-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        >
            {/* Scanline overlay for terminal feel */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-30"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)",
                }}
                aria-hidden
            />

            {/* Header row */}
            <div className="relative z-10 flex items-center justify-between">
                <span
                    className="font-mono text-xs font-medium uppercase tracking-widest opacity-70"
                    style={{ color: accent }}
                >
                    &gt; [PORTAL]
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-text-secondary opacity-60">
                    external link
                </span>
            </div>

            {/* Main content */}
            <div className="relative z-10 mt-3 flex flex-1 flex-col justify-center">
                <h3 className="font-mono text-lg font-bold tracking-tight text-white sm:text-xl">
                    PORTAL: ARMORY
                </h3>
                <p className="mt-0.5 font-mono text-[11px] leading-tight text-text-secondary sm:text-xs">
                    Open Toolbox / Loadouts / Intel
                </p>
            </div>

            {/* Footer row */}
            <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2">
                {/* Status indicators */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] sm:gap-4 sm:text-xs">
                    {STATUS_ITEMS.map(({ tag, value, valueClass }) => (
                        <span key={tag} className="flex items-center gap-1">
                            <span className="text-text-secondary">{tag}:</span>
                            <span className={valueClass}>{value}</span>
                        </span>
                    ))}
                </div>

                {/* CTA - brighter with glow */}
                <span
                    className="font-mono text-xs font-semibold tracking-wide transition-all duration-200 group-hover:translate-x-1"
                    style={{
                        color: "#00FFFF",
                        textShadow: "0 0 8px rgba(0,255,255,0.6), 0 0 16px rgba(0,240,255,0.3)",
                    }}
                >
                    Enter Armory →
                </span>
            </div>
        </a>
    );
}

