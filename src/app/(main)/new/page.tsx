import RecipeForm from "@/app/components/recipes/RecipeForm";
import { createRecipe } from "./actions";

export default async function NewRecipePage() {

  return <RecipeForm mode="new" action={createRecipe} />;
}
