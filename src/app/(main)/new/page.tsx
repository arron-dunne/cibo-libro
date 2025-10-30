import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RecipeForm from "@/app/components/recipes/RecipeForm";
import { createRecipe } from "./actions";

export const dynamic = "force-dynamic"; // ensure fresh auth for this page

export default async function NewRecipePage() {

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <RecipeForm mode="new" action={createRecipe}/>;
}