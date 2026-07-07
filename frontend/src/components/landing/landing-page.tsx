"use client";

import Link from "next/link";
import { Ghost, GhostSmall } from "@/components/landing/ghost";

const features = [
  {
    title: "Drop Any CSV",
    desc: "Upload spreadsheets from any source — leads, contacts, deals. We handle messy headers, weird formats, and inconsistent data.",
    accent: "var(--color-buttercream)",
  },
  {
    title: "AI Maps Everything",
    desc: "Gemini reads your columns, understands context, and maps fields automatically. No manual column matching required.",
    accent: "var(--color-blush-mist)",
  },
  {
    title: "One-Click Import",
    desc: "Review, confirm, done. Records land in your CRM with proper formatting, validation, and deduplication built in.",
    accent: "var(--color-ghost-lavender)",
  },
  {
    title: "Smart Validation",
    desc: "Phones get country codes. Emails get normalized. Names get title-cased. Every record cleaned before it hits your database.",
    accent: "var(--color-periwinkle)",
  },
];

const stats = [
  { value: "15s", label: "Avg import time" },
  { value: "99.2%", label: "Field accuracy" },
  { value: "0", label: "Manual mapping" },
  { value: "∞", label: "CSV formats" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper-white)" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-4">
        <div
          className="flex items-center gap-6 px-6 py-3 w-full max-w-[1200px]"
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

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="phantom-body-sm hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-aubergine)" }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/app"
            className="phantom-btn-primary phantom-body-sm shrink-0"
            style={{ padding: "12px 32px" }}
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero — Dark */}
      <section className="phantom-section-dark pt-40 pb-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 phantom-pill" style={{ background: "rgba(226,223,254,0.15)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-mint-signal)" }} />
            <span className="phantom-caption" style={{ color: "var(--color-periwinkle)" }}>
              AI-Powered CSV Import
            </span>
          </div>

          <h1 className="phantom-heading-lg mb-6" style={{ color: "var(--color-paper-white)" }}>
            Import any CSV.
            <br />
            
            Grow your leads.
          </h1>

          <p
            className="phantom-subheading mb-12 max-w-[560px] mx-auto"
            style={{ color: "var(--color-periwinkle)", fontWeight: 350 }}
          >
            Drop a spreadsheet. AI maps every field. Records land clean in your CRM.
            No manual work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="phantom-btn-primary">
              Start Importing
            </Link>
            <a href="#how-it-works" className="phantom-btn-ghost" style={{ borderColor: "rgba(226,223,254,0.3)", color: "var(--color-periwinkle)" }}>
              See how it works →
            </a>
          </div>

          {/* Floating Ghost */}
          <div className="mt-16 flex justify-center">
            <Ghost size={100} className="text-[var(--color-periwinkle)] opacity-30" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6" style={{ background: "var(--color-bone)" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="phantom-heading" style={{ color: "var(--color-aubergine)" }}>
                {stat.value}
              </p>
              <p className="phantom-caption mt-1" style={{ color: "var(--color-fog)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <p className="phantom-caption mb-4 uppercase" style={{ color: "var(--color-periwinkle)" }}>
              Features
            </p>
            <h2 className="phantom-heading" style={{ color: "var(--color-aubergine)" }}>
              Three steps. Zero hassle.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="phantom-card p-12 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: "var(--color-paper-white)",
                  border: "1px solid var(--color-ash)",
                }}
              >
                <div
                  className="w-12 h-12 phantom-pill flex items-center justify-center mb-6"
                  style={{ background: f.accent }}
                >
                  <GhostSmall className="text-[var(--color-aubergine)]" />
                </div>
                <h3
                  className="phantom-heading-sm mb-3"
                  style={{ color: "var(--color-obsidian)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="phantom-body"
                  style={{ color: "var(--color-fog)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Dark */}
      <section id="how-it-works" className="phantom-section-dark py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <p className="phantom-caption mb-4 uppercase" style={{ color: "var(--color-periwinkle)" }}>
              How it works
            </p>
            <h2 className="phantom-heading-lg" style={{ color: "var(--color-paper-white)" }}>
              Import in{" "}
              <span style={{ color: "var(--color-periwinkle)" }}>thr</span>
              ee taps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Drop your CSV",
                desc: "Drag any spreadsheet onto the importer. We read 100+ formats automatically.",
              },
              {
                step: "02",
                title: "AI maps fields",
                desc: "Gemini analyzes columns, detects types, and maps everything to your CRM schema.",
              },
              {
                step: "03",
                title: "Confirm & import",
                desc: "Preview mapped records. Hit confirm. Clean data lands in your CRM in seconds.",
              },
            ].map((s, i) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-16 h-16 phantom-pill flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(226,223,254,0.15)" }}
                >
                  <span
                    className="phantom-heading-sm"
                    style={{ color: "var(--color-periwinkle)" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3
                  className="phantom-heading-sm mb-3"
                  style={{ color: "var(--color-paper-white)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="phantom-body"
                  style={{ color: "var(--color-periwinkle)" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-32 px-6" style={{ background: "var(--color-bone)" }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="phantom-caption mb-4 uppercase" style={{ color: "var(--color-periwinkle)" }}>
            Handles it all
          </p>
          <h2 className="phantom-heading mb-16" style={{ color: "var(--color-aubergine)" }}>
            Any CSV. Any mess.
          </h2>

          <div className="flex flex-wrap justify-center gap-3 max-w-[800px] mx-auto">
            {[
              "Missing columns", "Wrong date formats", "Split phone numbers",
              "Mixed name fields", "Duplicate headers", "Extra whitespace",
              "Unicode characters", "Nested JSON in CSV", "Multiple email columns",
              "Inconsistent statuses", "Empty rows", "Custom delimiters",
            ].map((f) => (
              <span
                key={f}
                className="phantom-pill px-5 py-2 phantom-body-sm"
                style={{
                  background: "var(--color-paper-white)",
                  color: "var(--color-aubergine)",
                  border: "1px solid var(--color-ash)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-32 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <Ghost size={60} className="mx-auto mb-8 text-[var(--color-periwinkle)] opacity-40" />
          <blockquote
            className="phantom-heading mb-8"
            style={{ color: "var(--color-aubergine)" }}
          >
            &ldquo;We used to spend 2 hours per CSV import. Now it&rsquo;s 15 seconds.&rdquo;
          </blockquote>
          <p className="phantom-body" style={{ color: "var(--color-fog)" }}>
            — Every sales ops team, eventually
          </p>
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="phantom-section-dark py-32 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2
            className="phantom-heading-lg mb-6"
            style={{ color: "var(--color-paper-white)" }}
          >
            Ready to{" "}
            
            Grow?
          </h2>
          <p
            className="phantom-subheading mb-12"
            style={{ color: "var(--color-periwinkle)" }}
          >
            Import your first CSV in under 30 seconds. No signup required.
          </p>
          <Link href="/app" className="phantom-btn-primary text-lg" style={{ padding: "20px 64px" }}>
            Open GrowEasy CRM
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid var(--color-ash)" }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GhostSmall />
            <span className="phantom-body-sm" style={{ color: "var(--color-aubergine)" }}>
              GrowEasy CRM
            </span>
          </div>

          <div className="flex items-center gap-8">
            {["Features", "Docs", "GitHub"].map((link) => (
              <a
                key={link}
                href="#"
                className="phantom-body-sm hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-fog)" }}
              >
                {link}
              </a>
            ))}
          </div>

          <p className="phantom-caption" style={{ color: "var(--color-fog)" }}>
            Baked with ❤️ by <a href="https://www.bakery.dev" target="_blank" rel="noopener noreferrer">Ashutosh Kumar</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
