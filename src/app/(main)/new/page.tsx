// app/new/page.tsx

// Server component page that renders the AddRecipeClient behind auth.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
// import AddRecipeClient from "./AddRecipeClient";
import RecipeForm from "@/app/(main)/components/recipes/RecipeForm";
import { createRecipe } from "./actions";

export const dynamic = "force-dynamic"; // ensure fresh auth for this page

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    // If you have a custom sign‑in route, use that instead
    redirect("/login?next=/new");
  }

  // You can pass initial data here if you later support editing an existing draft
  return <RecipeForm mode="new" action={createRecipe}/>;
}

// interface RecipeFormProps {
//   mode: "new" | "edit";
//   recipe?: Recipe; // optional existing recipe data
//   action: (recipe: Recipe) => Promise<void> | void; // server action for handling submitted recipe
// }