import Image from "next/image";
import { Footer } from "@/app/components/footer/Footer";
import { SecondaryButton } from "../components/buttons/Buttons";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full px-10 flex flex-col">
        <div className="flex justify-between items-center">
          {/* Logo above panel */}
          <div className="my-10 w-48">
            <Image
              src="/logo.png"
              alt="Cibo Libro"
              width={300}
              height={70}
              priority
            />
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-slate-600">New here?</span>
            <SecondaryButton>Create Account</SecondaryButton>
          </div>
        </div>

        {/* Form panel */}
        <section className="w-full max-w-md mx-auto">{children}</section>
      </div>
      {/* <Footer /> */}
    </>
  );
}
