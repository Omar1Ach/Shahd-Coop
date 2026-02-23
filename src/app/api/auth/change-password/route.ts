import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { changePasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("+password");
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Password change not available for OAuth accounts" },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  await User.findByIdAndUpdate(session.user.id, {
    $set: { password: await bcrypt.hash(parsed.data.newPassword, 12) },
  });

  return NextResponse.json({ message: "Password changed successfully" });
}
