import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { verifyTotp, verifyBackupCode } from "@/lib/auth/totp";

// Called during login flow when 2FA is required
export async function POST(req: NextRequest) {
  const { userId, token, isBackupCode } = await req.json();

  if (!userId || !token) {
    return NextResponse.json({ error: "userId and token required" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(userId).select("twoFactorEnabled twoFactorSecret backupCodes");

  if (!user || !user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA not enabled for this user" }, { status: 400 });
  }

  if (isBackupCode) {
    const matchIndex = user.backupCodes?.findIndex((hashed: string) =>
      verifyBackupCode(token, hashed)
    );

    if (matchIndex === undefined || matchIndex === -1) {
      return NextResponse.json({ error: "Invalid backup code" }, { status: 400 });
    }

    // Remove used backup code (one-time use)
    user.backupCodes!.splice(matchIndex, 1);
    await user.save();

    return NextResponse.json({ valid: true });
  }

  const isValid = verifyTotp(token, user.twoFactorSecret!);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid TOTP token" }, { status: 400 });
  }

  return NextResponse.json({ valid: true });
}
