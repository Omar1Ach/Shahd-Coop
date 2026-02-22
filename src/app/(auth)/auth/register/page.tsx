"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Spinner } from "@/components/ui";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <p className="text-2xl mb-2">Check your email</p>
            <p className="text-[var(--color-text-secondary)] text-sm">
              We sent a verification link to <strong>{form.email}</strong>.
              Please click it to activate your account.
            </p>
            <div className="mt-6">
              <Link href="/auth/login" className="text-[var(--color-primary)] hover:underline text-sm">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder="Your full name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Min 8 characters"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

