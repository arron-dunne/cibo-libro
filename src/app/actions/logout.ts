"use server";

import { signOut } from "@/lib/auth/auth";

// server side client action for logging out
// call this from client components
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
