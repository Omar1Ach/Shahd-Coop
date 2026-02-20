import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { verifyTotp } from "@/lib/auth/totp";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  await connectDB();
  const user = await User.findById(session.user.id).select("twoFactorEnabled twoFactorSecret");

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
  }

  const isValid = verifyTotp(token, user.twoFactorSecret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid TOTP token" }, { status: 400 });
  }

  await User.findByIdAndUpdate(session.user.id, {
    twoFactorEnabled: false,
    $unset: { twoFactorSecret: "", backupCodes: "" },
  });

  return NextResponse.json({ message: "2FA disabled successfully" });
}
