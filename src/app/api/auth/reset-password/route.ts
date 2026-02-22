import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashToken } from "@/lib/utils/hash-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const { token, password } = parsed.data;

    // Hash the incoming token to compare against the stored hash
    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("[RESET_PASSWORD]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
