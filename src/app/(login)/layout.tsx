import Image from "next/image";
import { Footer } from "@/app/components/footer/Footer";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full px-4 flex flex-col place-items-center">
        {/* Logo above panel */}
        <div className="my-10">
          <Image
            src="/logo.png"
            alt="Cibo Libro"
            width={300}
            height={70}
            priority
          />
        </div>

        {/* Floating panel */}
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-10 shadow-lg backdrop-blur">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
