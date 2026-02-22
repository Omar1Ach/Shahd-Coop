"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function TwoFactorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Two-Factor Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--color-text-secondary)]">
            Complete sign in to continue.
          </p>
          <Link href="/auth/login" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
