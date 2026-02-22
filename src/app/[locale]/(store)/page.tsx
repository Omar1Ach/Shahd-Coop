import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "ShahdCoop — Premium Natural Honey",
};

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="text-center max-w-2xl">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          {t("kicker")}
        </p>
        <h1
          className="text-5xl sm:text-6xl font-semibold leading-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.025em",
          }}
        >
          {t("title")},<br />
          <span style={{ color: "var(--color-primary)" }}>{t("titleAccent")}</span>
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("description")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold transition-colors"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
          }}
        >
          {t("ctaShop")}
        </Link>
        <Link
          href="/about"
          className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold transition-colors"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        >
          {t("ctaStory")}
        </Link>
      </div>

      <div
        className="rounded-xl border px-5 py-3 text-xs"
        style={{
          background: "var(--color-surface-1)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        {t("sprint")}
      </div>
    </main>
  );
}
