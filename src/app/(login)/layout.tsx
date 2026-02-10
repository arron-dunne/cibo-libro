import Image from "next/image";
import { Footer } from "@/app/components/footer/Footer";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col w-full place-items-center">
        {/* Logo above panel */}
        <div className="my-10">
          <Image
            src="/images/logo.png"
            alt="Cibo Libro"
            width={300}
            height={70}
            priority
          />
        </div>

        {/* Floating panel */}
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/65 p-10 shadow-2xl backdrop-blur">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
