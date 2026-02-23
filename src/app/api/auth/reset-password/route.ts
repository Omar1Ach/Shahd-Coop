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

    // Atomically find, update password, and $unset the reset token in one operation.
    // This avoids token replay (select:false fields wouldn't be cleared by .save()).
    const user = await User.findOneAndUpdate(
      {
        passwordResetToken: hashToken(token),
        passwordResetExpires: { $gt: new Date() },
      },
      {
        $set: { password: await bcrypt.hash(password, 12) },
        $unset: { passwordResetToken: "", passwordResetExpires: "" },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("[RESET_PASSWORD]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
