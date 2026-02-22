"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center text-sm text-[var(--color-text-secondary)]">
              <p>If that email exists, a reset link has been sent.</p>
              <Link href="/auth/login" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Send Reset Link"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
                <Link href="/auth/login" className="text-[var(--color-primary)] hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

