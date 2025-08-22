// app/new/page.tsx

// Server component page that renders the AddRecipeClient behind auth.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AddRecipeClient from "./AddRecipeClient";

export const dynamic = "force-dynamic"; // ensure fresh auth for this page

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    // If you have a custom sign‑in route, use that instead
    redirect("/login?next=/new");
  }

  // You can pass initial data here if you later support editing an existing draft
  return <AddRecipeClient />;
}
