"use client";

import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const STATUS_ITEMS = [
    { tag: "OPS", value: "GREEN", valueClass: "text-cyan-300 font-bold" },
    { tag: "HEAT", value: "LOW", valueClass: "text-cyan-300" },
    { tag: "SIGNAL", value: "CLEAN", valueClass: "text-cyan-300" },
];

export default function PortalCell() {
    return (
        <a
            href="https://postsoma-2050.website"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Armory (postsoma-2050.website)"
            className="portal-card group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded border border-solid border-cyan-500/40 bg-gradient-to-br from-slate-950 via-neutral-900 to-zinc-950 p-5 shadow-[0_0_12px_rgba(6,182,212,0.12),inset_0_1px_0_rgba(6,182,212,0.06)] transition-all duration-150 ease-out hover:border-dashed hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(6,182,212,0.12)] active:shadow-[0_0_36px_rgba(6,182,212,0.6)] active:border-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        >
            {/* Cyan cold sheen */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-[0.25]"
                style={{
                    backgroundImage:
                        "linear-gradient(105deg, rgba(6,182,212,0.05) 0%, transparent 42%, transparent 58%, rgba(14,165,233,0.03) 100%)",
                }}
                aria-hidden
            />
            {/* Tech dot-matrix grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-[0.35]"
                style={{
                    backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                }}
                aria-hidden
            />
            {/* Fine horizontal grain — brushed metal */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-15"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(148,163,184,0.04) 3px, rgba(148,163,184,0.04) 4px)",
                }}
                aria-hidden
            />
            {/* Terminal scanlines */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-25"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.02) 2px, rgba(6,182,212,0.02) 4px)",
                }}
                aria-hidden
            />

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-400/90">
                        &gt;_ [SYS_PORTAL]
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider text-cyan-400/90 bg-cyan-950/45 px-1.5 py-0.5 rounded border border-cyan-500/25">
                        {"// SYS.REDIRECT"}
                    </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-slate-500">
                    EXTERNAL LINK
                </span>
            </div>

            <div className="relative z-10 mt-3 flex flex-1 flex-col justify-center">
                <h3 className="font-mono text-lg font-bold tracking-tight text-white sm:text-xl">
                    PORTAL: ARMORY
                </h3>
                <p className="mt-0.5 font-mono text-[11px] leading-tight text-slate-400 sm:text-xs">
                    Curated tools & resources  //  My deployed projects
                </p>
            </div>

            <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] sm:gap-4 sm:text-xs">
                    {STATUS_ITEMS.map(({ tag, value, valueClass }) => (
                        <span key={tag} className="flex items-center gap-1">
                            <span className="text-slate-500">{tag}:</span>
                            <span className={valueClass}>{value}</span>
                        </span>
                    ))}
                </div>

                <span
                    className="font-mono text-xs font-semibold tracking-wide text-cyan-200"
                    style={{
                        textShadow:
                            "0 0 8px rgba(6,182,212,0.4), 0 0 16px rgba(6,182,212,0.2)",
                    }}
                >
                    Enter Armory{" "}
                    <span className="text-cyan-400 font-bold ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 inline-block">
                        ↗
                    </span>
                </span>
            </div>
        </a>
    );
}
