"use client";

import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const STATUS_ITEMS = [
    { label: "NOISE   :  ", value: "ZERO", valueClass: "text-stone-300 font-bold" },
    { label: "FOCUS   :  ", value: "LOCKED", valueClass: "text-amber-200/80" },
    { label: "MODE    :  ", value: "SELAH", valueClass: "text-amber-300" },
];

export default function PortalSelahCell() {
    return (
        <a
            href="https://www.readselah.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open ReadSelah (readselah.org)"
            className="portal-card group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded border border-solid border-amber-500/30 bg-gradient-to-br from-slate-950 via-[#0e0d0c] to-zinc-950 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.04)_0%,transparent_70%)] p-5 shadow-[0_0_12px_rgba(253,230,138,0.04),inset_0_1px_0_rgba(253,230,138,0.03)] transition-all duration-700 ease-in-out hover:border-dashed hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(253,230,138,0.15),inset_0_1px_0_rgba(253,230,138,0.06)] active:shadow-[0_0_30px_rgba(253,230,138,0.22)] active:border-amber-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 md:col-span-2"
        >
            {/* Sanctuary soft central radial glow (No grids or scanlines) */}
            <div
                className="pointer-events-none absolute inset-0 rounded opacity-[0.8]"
                style={{
                    backgroundImage: "radial-gradient(circle at center, rgba(253, 230, 138, 0.045) 0%, transparent 75%)",
                }}
                aria-hidden
            />

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-amber-200/80">
                        [ † ] SELAH
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider text-amber-200/90 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {"// SYS.REDIRECT"}
                    </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-stone-500">
                    EXTERNAL LINK
                </span>
            </div>

            <div className="relative z-10 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 flex-1">
                {/* Left: Text */}
                <div className="flex flex-col justify-center">
                    <h3 className="font-mono text-lg font-bold tracking-tight text-amber-200 sm:text-xl">
                        PORTAL: READSELAH
                    </h3>
                    <p className="mt-0.5 font-mono text-[11px] leading-tight text-stone-400 sm:text-xs">
                        Quiet workspace / Scripture study / AI tools
                    </p>
                </div>

                {/* Middle: Parameters */}
                <div className="flex flex-col gap-0.5 font-mono text-[10px] sm:text-xs whitespace-pre md:border-l md:border-amber-500/10 md:pl-6">
                    {STATUS_ITEMS.map(({ label, value, valueClass }) => (
                        <span key={label} className="flex items-center">
                            <span className="text-stone-500">{label}</span>
                            <span className={valueClass}>{value}</span>
                        </span>
                    ))}
                </div>

                {/* Right: Button */}
                <div className="flex items-center md:justify-end">
                    <span
                        className="font-mono text-xs font-semibold tracking-wide text-amber-200"
                        style={{
                            textShadow:
                                "0 0 8px rgba(251,191,36,0.35), 0 0 16px rgba(251,191,36,0.15)",
                        }}
                    >
                        Enter Sanctuary{" "}
                        <span className="text-amber-400 font-bold ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-700 inline-block">
                            ↗
                        </span>
                    </span>
                </div>
            </div>
        </a>
    );
}
