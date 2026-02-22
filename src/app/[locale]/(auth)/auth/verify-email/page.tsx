"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)]"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="mt-3 text-[var(--color-text-secondary)]">Your email has been verified successfully.</p>
              <Link href="/auth/login" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
                Sign in now -&gt;
              </Link>
            </>
          ) : status === "error" ? (
            <>
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)]"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <p className="mt-3 text-[var(--color-text-secondary)]">Invalid or expired verification link.</p>
              <Link href="/auth/register" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
                Register again -&gt;
              </Link>
            </>
          ) : (
            <>
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-info-bg)] text-[var(--color-info)]"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6L12 13L2 6" />
                </svg>
              </div>
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

