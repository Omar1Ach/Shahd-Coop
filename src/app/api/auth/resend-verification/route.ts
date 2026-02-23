import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email/resend";
import { hashToken } from "@/lib/utils/hash-token";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: parsed.data.email }).select(
    "name email isEmailVerified"
  );

  // Always return same response to prevent email enumeration
  const successMsg = "If that email exists and is unverified, a new verification link has been sent.";

  if (!user || user.isEmailVerified) {
    return NextResponse.json({ message: successMsg });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await User.findByIdAndUpdate(user._id, {
    $set: {
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: expires,
    },
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    token: rawToken,
  });

  return NextResponse.json({ message: successMsg });
}
