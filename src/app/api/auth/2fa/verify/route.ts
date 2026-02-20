import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { verifyTotp, generateBackupCodes, hashBackupCode } from "@/lib/auth/totp";
import { getOtp, deleteOtp } from "@/lib/redis/cache";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  // Get temporary secret from Redis
  const secret = await getOtp(session.user.id);
  if (!secret) {
    return NextResponse.json({ error: "Setup session expired. Please restart 2FA setup." }, { status: 400 });
  }

  const isValid = verifyTotp(token, secret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid TOTP token" }, { status: 400 });
  }

  // Generate backup codes
  const backupCodes = generateBackupCodes(8);
  const hashedBackupCodes = backupCodes.map(hashBackupCode);

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, {
    twoFactorEnabled: true,
    twoFactorSecret: secret,
    backupCodes: hashedBackupCodes,
  });

  // Clean up temp secret
  await deleteOtp(session.user.id);

  return NextResponse.json({
    message: "2FA enabled successfully",
    backupCodes, // Show only once!
  });
}
