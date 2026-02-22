import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { verifyTotp, generateBackupCodes, hashBackupCode } from "@/lib/auth/totp";
import { getOtp, deleteOtp } from "@/lib/redis/cache";

/**
 * POST /api/auth/2fa/verify
 * Confirms a TOTP token during 2FA setup.
 * Saves hashed backup codes to DB as { code, usedAt } objects.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const token: string | undefined = body?.token;
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // Retrieve temporary secret from Redis
  const secret = await getOtp(session.user.id);
  if (!secret) {
    return NextResponse.json(
      { error: "Setup session expired. Please restart 2FA setup." },
      { status: 400 }
    );
  }

  const isValid = verifyTotp(token, secret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid TOTP token" }, { status: 400 });
  }

  // Generate 8 backup codes and store hashed versions
  const plainCodes = generateBackupCodes(8);
  const hashedCodes = plainCodes.map((code) => ({
    code: hashBackupCode(code),
  }));

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, {
    twoFactorEnabled: true,
    twoFactorSecret: secret,
    twoFactorBackupCodes: hashedCodes,
  });

  // Clean up temporary secret from Redis
  await deleteOtp(session.user.id);

  return NextResponse.json({
    message: "2FA enabled successfully.",
    backupCodes: plainCodes, // Shown to user ONCE — never stored in plain text
  });
}
