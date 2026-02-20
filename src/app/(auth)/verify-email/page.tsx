"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <>
              <p className="text-4xl">✅</p>
              <p className="mt-3 text-[var(--color-text-secondary)]">Your email has been verified successfully.</p>
              <Link href="/login" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
                Sign in now →
              </Link>
            </>
          ) : status === "error" ? (
            <>
              <p className="text-4xl">❌</p>
              <p className="mt-3 text-[var(--color-text-secondary)]">Invalid or expired verification link.</p>
              <Link href="/register" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
                Register again →
              </Link>
            </>
          ) : (
            <>
              <p className="text-4xl">📧</p>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
