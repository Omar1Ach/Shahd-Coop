export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
          🍯 ShahdCoop
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Premium natural honey &amp; bee products — coming soon
        </p>
      </div>
      <div
        className="rounded-xl border px-6 py-4 text-sm"
        style={{
          background: "var(--color-surface-1)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        🚧 Sprint 1 in progress — Foundation &amp; Infrastructure
      </div>
    </main>
  );
}
