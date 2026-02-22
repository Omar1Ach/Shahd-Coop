import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("common");

  return (
    <footer className="ds-footer">
      <div className="page">
        {t("appName")} Design System v1.0 · Minimal · Warm · Premium-Natural
      </div>
    </footer>
  );
}