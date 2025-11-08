import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Session API Route
 * 
 * Returns the current user session
 */
export async function GET() {
  const session = await auth();
  return NextResponse.json(session);
}

