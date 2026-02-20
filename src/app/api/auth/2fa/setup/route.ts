import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { generateTotpSecret, getTotpUri } from "@/lib/auth/totp";
import { setOtp } from "@/lib/redis/cache";
import QRCode from "qrcode";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select("email twoFactorEnabled");

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA already enabled" }, { status: 400 });
  }

  const secret = generateTotpSecret();
  const uri = getTotpUri(secret, user.email);
  const qrCodeDataUrl = await QRCode.toDataURL(uri);

  // Store secret temporarily in Redis (10 min) until confirmed
  await setOtp(session.user.id, secret);

  return NextResponse.json({ secret, qrCode: qrCodeDataUrl });
}
