"use client";

import { cn } from "@/lib/utils";

interface GhostProps {
  className?: string;
  size?: number;
}

export function Ghost({ className, size = 80 }: GhostProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("ghost-float", className)}
    >
      {/* Ghost Body */}
      <path
        d="M60 10C35 10 15 30 15 55V95C15 95 25 85 35 95C45 105 55 85 60 95C65 85 75 105 85 95C95 85 105 95 105 95V55C105 30 85 10 60 10Z"
        fill="currentColor"
        className="text-[var(--color-periwinkle)]"
      />
      {/* Left Eye */}
      <ellipse
        cx="45"
        cy="50"
        rx="6"
        ry="7"
        fill="var(--color-paper-white)"
        className="ghost-blink"
      />
      <ellipse
        cx="46"
        cy="49"
        rx="3"
        ry="3.5"
        fill="var(--color-aubergine)"
      />
      {/* Right Eye */}
      <ellipse
        cx="75"
        cy="50"
        rx="6"
        ry="7"
        fill="var(--color-paper-white)"
        className="ghost-blink"
      />
      <ellipse
        cx="76"
        cy="49"
        rx="3"
        ry="3.5"
        fill="var(--color-aubergine)"
      />
      {/* Cheeks */}
      <circle cx="35" cy="60" r="5" fill="var(--color-blush-mist)" opacity="0.6" />
      <circle cx="85" cy="60" r="5" fill="var(--color-blush-mist)" opacity="0.6" />
      {/* Mouth */}
      <path
        d="M52 68C55 72 65 72 68 68"
        stroke="var(--color-aubergine)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function GhostSmall({ className }: { className?: string }) {
  return <Ghost className={className} size={32} />;
}
