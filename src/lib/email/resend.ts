import { Resend } from "resend";
import { routing } from "@/i18n/routing";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  );
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

export async function sendVerificationEmail(args: {
  name: string;
  email: string;
  token: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set");

  const url = `${getBaseUrl()}/api/auth/verify-email?token=${args.token}`;
  const resend = getResendClient();

  await resend.emails.send({
    from,
    to: args.email,
    subject: "Verify your email",
    text: `Hi ${args.name}, verify your email: ${url}`,
    html: `<p>Hi ${args.name},</p><p>Verify your email:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendPasswordResetEmail(args: {
  name: string;
  email: string;
  token: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set");

  const url = `${getBaseUrl()}/${routing.defaultLocale}/auth/reset-password?token=${args.token}`;
  const resend = getResendClient();

  await resend.emails.send({
    from,
    to: args.email,
    subject: "Reset your password",
    text: `Hi ${args.name}, reset your password: ${url}`,
    html: `<p>Hi ${args.name},</p><p>Reset your password:</p><p><a href="${url}">${url}</a></p>`,
  });
}

