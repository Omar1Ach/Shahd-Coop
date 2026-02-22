// Homepage — placeholder until Sprint 2 shop pages are built
// This is a Server Component — no "use client" needed.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShahdCoop — Premium Natural Honey",
};

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          🌿 Moroccan Beekeeping Cooperative
        </p>
        <h1
          className="text-5xl sm:text-6xl font-semibold leading-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.025em",
          }}
        >
          Pure Honey,<br />
          <span style={{ color: "var(--color-primary)" }}>Direct from the Hive</span>
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          ShahdCoop connects you directly with cooperative beekeepers across Morocco.
          Every jar tells the story of ancient beekeeping traditions and pristine natural landscapes.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold transition-colors"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
          }}
        >
          Shop Honey
        </a>
        <a
          href="/about"
          className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold transition-colors"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        >
          Our Story
        </a>
      </div>

      {/* Sprint status badge */}
      <div
        className="rounded-xl border px-5 py-3 text-xs"
        style={{
          background: "var(--color-surface-1)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        🚧 Sprint 1 — Foundation &amp; Infrastructure in progress
      </div>
    </main>
  );
}
