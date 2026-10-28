import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user.isAdmin) {
    redirect("/home");
  }

  return (
    <p>Hello Admin</p>
  )
}