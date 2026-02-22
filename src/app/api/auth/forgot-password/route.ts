import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email/resend";
import { hashToken } from "@/lib/utils/hash-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    // Generate raw token for email, store only the hash in DB
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail({ name: user.name, email: user.email, token: rawToken });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw emailError;
    }

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("[FORGOT_PASSWORD]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
