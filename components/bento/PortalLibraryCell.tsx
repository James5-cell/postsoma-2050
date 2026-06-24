"use client";

import { useCallback, useState } from "react";

const LIBRARY_URL = "https://postsomabooks.qzz.io/";
const LIBRARY_ACCESS_PASSWORD = "3yyD9R4tUa8y";

function LibraryIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <rect
                x="6"
                y="10"
                width="10"
                height="28"
                rx="1"
                className="stroke-amber-500/80"
                strokeWidth="1.5"
                fill="rgba(245,158,11,0.08)"
            />
            <rect
                x="19"
                y="6"
                width="10"
                height="32"
                rx="1"
                className="stroke-amber-400/90"
                strokeWidth="1.5"
                fill="rgba(251,191,36,0.1)"
            />
            <rect
                x="32"
                y="14"
                width="10"
                height="24"
                rx="1"
                className="stroke-amber-500/70"
                strokeWidth="1.5"
                fill="rgba(245,158,11,0.06)"
            />
            <path
                d="M8 16h6M8 20h6M8 24h6M21 14h6M21 18h6M21 22h6M34 20h6M34 24h6"
                className="stroke-amber-600/50"
                strokeWidth="1"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function PortalLibraryCell() {
    const [copied, setCopied] = useState(false);

    const copyPassword = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(LIBRARY_ACCESS_PASSWORD);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.alert("Could not copy. Please enter the password manually.");
        }
    }, []);

    return (
        <div className="portal-card relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded border border-solid border-stone-500/40 bg-gradient-to-br from-stone-950/20 via-[#0e0d0c] to-neutral-950 p-5 shadow-[0_0_12px_rgba(120,113,108,0.03),inset_0_1px_0_rgba(120,113,108,0.02)] transition-all duration-700 ease-in-out hover:border-dashed hover:border-stone-400/40 hover:shadow-[0_0_20px_rgba(120,113,108,0.15),inset_0_1px_0_rgba(120,113,108,0.06)] has-[:focus-visible]:shadow-[0_0_20px_rgba(120,113,108,0.15)]">
            {/* Paper fiber — tighter weave */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-[0.65]"
                style={{
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(168,162,158,0.02) 1px, rgba(168,162,158,0.02) 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(120,113,108,0.025) 1px, rgba(120,113,108,0.025) 2px),
            radial-gradient(ellipse 90% 55% at 20% 25%, rgba(168,162,158,0.04) 0%, transparent 52%),
            radial-gradient(ellipse 60% 40% at 85% 75%, rgba(120,113,108,0.03) 0%, transparent 45%)
          `,
                }}
                aria-hidden
            />
            {/* Paper tooth / deckle edge feel */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-40 mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px 180px",
                }}
                aria-hidden
            />
            {/* Warm scanline */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-22"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,113,108,0.02) 2px, rgba(120,113,108,0.02) 4px)",
                }}
                aria-hidden
            />

            {/* Header tag and outbound badge */}
            <div className="relative z-[2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-stone-300">
                        [ + ] LIBRARY
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider text-stone-300 bg-stone-900/50 px-1.5 py-0.5 rounded border border-stone-850">
                        // SYS.REDIRECT
                    </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-stone-500">
                    EXTERNAL LINK
                </span>
            </div>

            {/* Body Title/Info */}
            <div className="relative z-[2] mt-4 flex items-start gap-4">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-stone-500/40 sm:h-16 sm:w-16"
                    style={{ backgroundColor: "rgba(120,113,108,0.06)" }}
                >
                    <LibraryIcon className="h-9 w-9 sm:h-10 sm:w-10 text-stone-300" />
                </div>
                <div className="min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-mono text-lg font-bold tracking-tight text-stone-300 sm:text-xl">
                            PORTAL: PERSONAL LIBRARY
                        </h3>
                        <span className="inline-flex shrink-0 rounded border border-stone-500/30 bg-stone-950/35 px-1.5 py-px font-mono text-[8px] uppercase tracking-wider text-stone-400/85">
                            Reading Mode
                        </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] leading-snug text-stone-450 sm:text-xs">
                        Private archive / AI reading hub
                    </p>
                </div>
            </div>

            {/* Action buttons and Steps */}
            <div className="relative z-[2] mt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                        href={LIBRARY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-stone-500/60 bg-stone-950/30 px-4 py-2.5 font-mono text-sm font-semibold tracking-wide text-stone-300 shadow-[0_0_12px_rgba(120,113,108,0.04)] transition-all duration-700 ease-in-out hover:border-stone-300 hover:bg-stone-900/40 hover:shadow-[0_0_18px_rgba(120,113,108,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0a09] active:scale-[0.99] group/lib-btn"
                        aria-label="Open Personal Library (postsomabooks.qzz.io)"
                        style={{
                            textShadow: "0 0 12px rgba(168,162,158,0.15)",
                        }}
                    >
                        Open Library{" "}
                        <span className="text-stone-300 font-bold ml-1 group-hover/lib-btn:translate-x-0.5 group-hover/lib-btn:-translate-y-0.5 transition-transform duration-700 inline-block">
                            ↗
                        </span>
                    </a>
                    <button
                        type="button"
                        onClick={copyPassword}
                        className="min-h-[44px] flex-1 rounded border border-stone-500/60 bg-stone-950/30 px-4 py-2.5 font-mono text-xs font-semibold tracking-wide text-stone-300 shadow-[0_0_12px_rgba(120,113,108,0.04)] transition-all duration-700 ease-in-out hover:border-stone-300 hover:bg-stone-900/40 hover:text-stone-100 hover:shadow-[0_0_18px_rgba(120,113,108,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0a09] active:scale-[0.99]"
                        style={{
                            textShadow: "0 0 10px rgba(168,162,158,0.15)",
                        }}
                        aria-label="Copy library access code to clipboard"
                    >
                        {copied ? "Copied ✓" : "Copy Access Code"}
                    </button>
                </div>
                <div className="flex flex-wrap items-center justify-between border-t border-stone-500/10 pt-2 font-mono text-[9px] leading-relaxed text-stone-450 sm:text-[10px]">
                    <p>
                        <span className="text-stone-400">Step 1:</span> Open Library
                    </p>
                    <div className="h-1 w-1 rounded-full bg-stone-500/30" />
                    <p>
                        <span className="text-stone-450">Step 2:</span> Paste access code
                        <span className="text-stone-500"> (auto-copied)</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
