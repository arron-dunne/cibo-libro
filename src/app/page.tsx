import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">Welcome to Cookbook</h1>
      {session?.user ? (
        <p>Signed in as <strong>{session.user.email}</strong>. Go to <a className="underline" href="/recipes">your recipes</a>.</p>
      ) : (
        <p><a className="underline" href="/signin">Sign in</a> to start adding recipes.</p>
      )}
    </main>
  );
}
