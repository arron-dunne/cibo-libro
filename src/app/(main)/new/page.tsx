// app/recipes/new/page.tsx
import { auth } from "@/lib/auth";
import AddRecipeClient from "./AddRecipeClient";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-lg">
        <h1 className="text-xl font-semibold">Please sign in</h1>
        <p className="mt-2 text-gray-700">You need an account to add recipes.</p>
        <a
          href="/signin?next=/recipes/new"
          className="mt-4 inline-block rounded-full bg-orange-600 px-4 py-2 font-semibold text-white"
        >
          Sign in
        </a>
      </div>
    );
  }

  // Slim wrapper: no extra white card – the client renders panels itself
  return <AddRecipeClient />;
}
