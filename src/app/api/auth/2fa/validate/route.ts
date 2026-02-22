import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { verifyTotp, verifyBackupCode } from "@/lib/auth/totp";

/**
 * POST /api/auth/2fa/validate
 * Called during the login flow when user has 2FA enabled.
 * Requires an active session (partial — user authenticated but 2FA pending).
 * Guards against IDOR by using session.user.id, not body.userId.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const token: string | undefined = body?.token;
  const isBackupCode: boolean = body?.isBackupCode === true;

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select(
    "+twoFactorSecret +twoFactorBackupCodes twoFactorEnabled"
  );

  if (!user || !user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA not enabled" }, { status: 400 });
  }

  if (isBackupCode) {
    const codes: { code: string; usedAt?: Date }[] =
      user.twoFactorBackupCodes ?? [];

    const matchIndex = codes.findIndex(
      (entry) => !entry.usedAt && verifyBackupCode(token, entry.code)
    );

    if (matchIndex === -1) {
      return NextResponse.json(
        { error: "Invalid or already used backup code" },
        { status: 400 }
      );
    }

    // Mark code as used (soft-delete preserves audit trail)
    codes[matchIndex].usedAt = new Date();
    user.twoFactorBackupCodes = codes;
    await user.save();

    return NextResponse.json({ valid: true });
  }

  const isValid = verifyTotp(token, user.twoFactorSecret!);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid TOTP token" }, { status: 400 });
  }

  return NextResponse.json({ valid: true });
}
