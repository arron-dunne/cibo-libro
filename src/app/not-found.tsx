"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/app/components/text/Headers";
import { PrimaryLinkButton } from "@/app/components/buttons/LinkButtons";
import { SecondaryButton } from "./components/buttons/Buttons";
import { ChevronLeft, House } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="mt-48 flex flex-col items-center">
      <Header>Page Not Found</Header>
      <p className="mt-4 mb-8 text-base sm:text-lg">We couldn&apos;t find page you&apos;re looking for.</p>

      <div className="flex gap-4">
        <SecondaryButton width="w-max sm:w-40" type="button" size="lg" onClick={() => router.back()}>
          <ChevronLeft />
          Back
        </SecondaryButton>
        <PrimaryLinkButton width="w-max sm:w-40" href="/" size="lg">
          <House />
          Home
        </PrimaryLinkButton>
      </div>
    </div>
  );
}
