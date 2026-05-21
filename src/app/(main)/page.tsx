import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";


export default async function IndexPage() {
  const session = await auth();
  session?.user ? redirect("/home") : redirect("/landing");
}
