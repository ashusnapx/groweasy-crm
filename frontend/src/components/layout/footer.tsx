import { GhostSmall } from "@/components/landing/ghost";

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ borderTop: "1px solid var(--color-ash)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GhostSmall />
          <span className="phantom-caption" style={{ color: "var(--color-fog)" }}>
            GrowEasy CRM
          </span>
        </div>
        <span className="phantom-caption" style={{ color: "var(--color-fog)" }}>
          Baked with ❤️ by <a href="https://www.bakery.dev" target="_blank" rel="noopener noreferrer">Ashutosh Kumar</a>
        </span>
      </div>
    </footer>
  );
}
