"use client";

import { motion } from "framer-motion";

const ALL_LABEL = "All";

export type SubCategoryFilterVariant = "default" | "minimal";

type SubCategoryFilterProps = {
  subCategories: string[];
  selected: string;
  onSelect: (value: string) => void;
  /** Category accent hex (e.g. #00F0FF for AI). Used for active border + glow. */
  accent: string;
  /** "minimal" = monochrome/white glow for Sheshin Notes library aesthetic */
  variant?: SubCategoryFilterVariant;
};

export default function SubCategoryFilter({
  subCategories,
  selected,
  onSelect,
  accent,
  variant = "default",
}: SubCategoryFilterProps) {
  const items = [ALL_LABEL, ...subCategories];

  const isMinimal = variant === "minimal";
  const activeBorder = isMinimal ? "#F5F5F5" : accent;
  const activeGlow = isMinimal
    ? "0 0 12px -2px rgba(245,245,245,0.4)"
    : `0 0 12px -4px ${accent}4D`;

  if (items.length <= 1) return null;

  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
      aria-label="Filter by sub-category"
    >
      {items.map((sub) => {
        const isActive = selected === sub;
        return (
          <button
            key={sub}
            type="button"
            onClick={() => onSelect(sub)}
            className={`
              relative shrink-0 rounded-full border px-4 py-2 font-mono text-sm transition-colors
              ${isActive ? "border-transparent" : "border-gray-700 bg-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300"}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="subcat-pill-bg"
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: activeBorder,
                  boxShadow: activeGlow,
                  backgroundColor: isMinimal ? "rgba(245,245,245,0.06)" : `${accent}15`,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10" style={isActive ? { color: activeBorder } : undefined}>
              {sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export { ALL_LABEL };
