"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";\nimport { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";

// â”€â”€â”€ Inner form â€” uses useSearchParams so must be inside Suspense â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      ...(requiresTwoFactor && { totpCode }),
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error === "TWO_FACTOR_REQUIRED") {
      setRequiresTwoFactor(true);
      return;
    }

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign in to ShahdCoop</CardTitle>
      </CardHeader>
      <CardContent>
        {verified && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Email verified! You can now sign in.
          </div>
        )}
        {reset && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Password reset successful. Please sign in.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!requiresTwoFactor ? (
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Your password"
              />
              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Enter the 6-digit code from your authenticator app.
              </p>
              <Input
                label="Authenticator Code"
                type="text"
                inputMode="numeric"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {requiresTwoFactor ? "Verify" : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => signIn("google", { callbackUrl })}
          >
            Continue with Google
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[var(--color-primary)] hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// â”€â”€â”€ Page â€” wraps form in Suspense (required for useSearchParams in Next.js 15) â”€â”€

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <Suspense fallback={<Spinner size="lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

