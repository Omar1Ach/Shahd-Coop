import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { routing } from "@/i18n/routing";
import { hashToken } from "@/lib/utils/hash-token";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    await connectDB();

    // Atomically verify and $unset the token in one operation to prevent replay.
    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: hashToken(token),
        emailVerificationExpires: { $gt: new Date() },
      },
      {
        $set: { isEmailVerified: true },
        $unset: { emailVerificationToken: "", emailVerificationExpires: "" },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/auth/login?verified=true`, req.url)
    );
  } catch (err) {
    console.error("[VERIFY_EMAIL]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
