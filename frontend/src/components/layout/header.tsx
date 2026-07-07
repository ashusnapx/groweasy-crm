"use client";

import Link from "next/link";
import { GhostSmall } from "@/components/landing/ghost";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSettingsClick?: () => void;
  hasApiKey?: boolean;
}

export function Header({ onSettingsClick, hasApiKey }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-center px-6 py-4">
      <div
        className="flex items-center gap-4 px-5 py-3 w-full max-w-6xl"
        style={{
          background: "var(--color-paper-white)",
          borderRadius: "100px",
          border: "1px solid var(--color-ash)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <GhostSmall />
          <span
            className="phantom-body-sm"
            style={{ color: "var(--color-aubergine)", fontWeight: 350 }}
          >
            GrowEasy
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status + Settings */}
        <nav className="flex items-center gap-3">
          <span
            className="phantom-caption hidden sm:block"
            style={{ color: "var(--color-fog)" }}
          >
            AI CSV Importer
          </span>
          <button
            onClick={onSettingsClick}
            className={cn(
              "flex items-center gap-2 px-4 py-2 phantom-pill transition-all duration-200",
              hasApiKey
                ? "text-[var(--color-aubergine)]"
                : "text-[var(--color-aubergine)]"
            )}
            style={{
              background: hasApiKey ? "var(--color-mint-signal)" : "var(--color-ghost-lavender)",
              color: hasApiKey ? "white" : "var(--color-aubergine)",
              boxShadow: hasApiKey ? "none" : "var(--shadow-glow)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="phantom-caption font-medium">
              {hasApiKey ? "Configured" : "Set API Key"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
