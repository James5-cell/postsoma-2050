"use client";

import { Cpu, Sparkles, AlertCircle, Compass, AlignLeft } from "lucide-react";

interface AISummaryData {
  keyTakeaway?: string;
  key_takeaway?: string;
  keyPoints?: string[];
  key_points?: string[];
  readingGuide?: string;
  reading_guide?: string;
}

interface AICardProps {
  rawSummary: string;
  readingTime?: number;
}

export default function AICard({ rawSummary, readingTime }: AICardProps) {
  if (!rawSummary || rawSummary.trim() === "") return null;

  let data: AISummaryData | null = null;
  let isJson = false;

  try {
    // Try to parse the JSON string from Notion
    data = JSON.parse(rawSummary);
    isJson = typeof data === "object" && data !== null;
  } catch (e) {
    // Not a JSON string, treat as plain text summary
    isJson = false;
  }

  // 1. JSON Structured Rendering
  if (isJson && data) {
    const takeaway = data?.keyTakeaway || data?.key_takeaway;
    const points = data?.keyPoints || data?.key_points;
    const guide = data?.readingGuide || data?.reading_guide || (readingTime ? `預計閱讀 ${readingTime} 分鐘` : undefined);

    if (!takeaway && (!points || points.length === 0) && !guide) {
      return null;
    }

    return (
      <section 
        className="relative mb-10 overflow-hidden rounded border border-accent-ai/30 bg-[#161d20]/50 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-ai/50"
        style={{
          boxShadow: "0 0 20px -5px rgba(0, 240, 255, 0.15)",
        }}
      >
        <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-accent-ai/10 blur-xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 h-24 w-24 rounded-full bg-accent-philosophy/5 blur-xl pointer-events-none" />

        {/* Cyberpunk Top Bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-ai opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-ai"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-accent-ai flex items-center gap-1.5">
              <Cpu size={14} className="animate-pulse" />
              AI Quantum Insights // 智能導讀
            </span>
          </div>
          {guide && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
              <Compass size={11} className="text-accent-philosophy" />
              <span>{guide}</span>
            </div>
          )}
        </div>

        {/* Key Takeaway */}
        {takeaway && (
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary/75 flex items-center gap-1.5">
              <Sparkles size={12} className="text-accent-ai" />
              Core Takeaway / 核心提煉
            </h4>
            <p className="font-sans text-[15px] leading-relaxed text-text-primary pl-4 border-l border-accent-ai/30">
              {takeaway}
            </p>
          </div>
        )}

        {/* Thought Nodes */}
        {points && points.length > 0 && (
          <div className="mt-5 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary/75 flex items-center gap-1.5">
              <AlertCircle size={12} className="text-accent-philosophy" />
              Thought Nodes / 思維要點
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
              {points.map((point, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2.5 rounded bg-white/[0.02] p-2.5 border border-white/5 font-sans text-sm text-text-secondary leading-relaxed hover:bg-white/[0.04] transition-colors"
                >
                  <span className="font-mono text-xs text-accent-ai mt-0.5">0{index + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  // 2. Plain Text Summary Rendering (Fallback for existing articles)
  return (
    <section 
      className="relative mb-10 overflow-hidden rounded border border-accent-ai/20 bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent-ai/35"
      style={{
        boxShadow: "0 0 16px -6px rgba(0, 240, 255, 0.1)",
      }}
    >
      <div className="absolute -left-12 -top-12 h-20 w-20 rounded-full bg-accent-ai/5 blur-xl pointer-events-none" />

      {/* Cyberpunk Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-ai/60"></span>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-accent-ai/80 flex items-center gap-1.5">
            <AlignLeft size={13} />
            Executive Summary // 內容大綱
          </span>
        </div>
        {readingTime && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <Compass size={11} className="text-accent-philosophy" />
            <span>預計閱讀 {readingTime} 分鐘</span>
          </div>
        )}
      </div>

      <p className="font-sans text-[14px] leading-relaxed text-text-secondary pl-3 border-l border-accent-ai/20">
        {rawSummary}
      </p>
    </section>
  );
}
