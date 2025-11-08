import { signOut } from "@/auth";

/**
 * Sign Out API Route
 */
export async function POST() {
  await signOut({ redirectTo: "/" });
}

