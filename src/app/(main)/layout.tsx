import { auth } from "@/lib/auth/auth";
import { Footer } from "@/app/components/footer/Footer";
import { Navbar } from "@/app/components/navbar/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // needed for logout and navbar email
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session ?? null}/>
      <main className="z-0 mx-auto w-full max-w-7xl px-8 py-4 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
