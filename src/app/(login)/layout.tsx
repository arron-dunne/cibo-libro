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
            src="/images/logo.png"
            alt="Cibo Libro"
            width={300}
            height={70}
            priority
          />
        </div>

        {/* Floating panel */}
        <section className="w-full max-w-md overflow-hidden rounded-4xl border border-white bg-amber-50/90 p-10 shadow-2xl backdrop-blur">
          {children}
        </section>
      </div>
      <Footer />
    </>
  );
}
