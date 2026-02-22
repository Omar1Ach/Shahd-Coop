import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import redis from "@/lib/redis/client";

export async function GET() {
  try {
    await connectDB();
    await redis.ping();

    return NextResponse.json({
      status: "ok",
      db: "connected",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Service unavailable" },
      { status: 503 }
    );
  }
}
