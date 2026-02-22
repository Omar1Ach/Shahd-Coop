"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";

// â”€â”€â”€ Inner form â€” uses useSearchParams so must be inside Suspense â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent>
          <p className="text-center text-red-500">
            Invalid or missing reset token. Please request a new password reset.
          </p>
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-[var(--color-primary)] hover:underline text-sm">
              Request new link
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword: confirm }),
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Reset failed. The link may have expired.");
      return;
    }

    router.push("/auth/login?reset=true");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Min 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
          />
          <Button type="submit" fullWidth loading={loading}>
            Reset Password
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-[var(--color-primary)] hover:underline">
            Back to Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <Suspense fallback={<Spinner size="lg" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

