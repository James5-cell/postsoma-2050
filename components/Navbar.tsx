"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CATEGORY_SLUGS, type Category } from "@/lib/design-tokens";

const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  ...(Object.entries(CATEGORY_SLUGS) as [Category, string][]).map(
    ([label, slug]) => ({ label, href: `/${slug}` })
  ),
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-bg/95 backdrop-blur-sm"
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-ai focus:ring-offset-2 focus:ring-offset-bg"
          aria-label="PostSoma home"
        >
          <Image
            src="/logo.png"
            alt="PostSoma 2050"
            width={160}
            height={40}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="focus:outline-none focus-visible:ring-0"
                >
                  <motion.span
                    className={`relative block px-3 py-2 font-mono text-sm transition-colors ${isActive
                      ? "text-accent-ai"
                      : "text-text-secondary hover:text-text-primary"
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="navbar-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-ai"
                        style={{
                          boxShadow: "0 0 12px 2px #00F0FF, 0 0 24px 4px rgba(0, 240, 255, 0.4)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border-subtle)] text-text-primary transition-colors hover:border-accent-ai hover:text-accent-ai focus:outline-none focus:ring-2 focus:ring-accent-ai md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-[var(--border-subtle)] md:hidden"
      >
        <ul className="flex flex-col gap-0 px-4 py-3">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 font-mono text-sm ${isActive ? "text-accent-ai" : "text-text-secondary"
                    } hover:text-text-primary`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.header>
  );
}
