import Link from "next/link";
import { PrimaryButton } from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";

export default function DonatePage() {
  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <Header>Leave a tip</Header>
      <SubHeader className="mt-4">
        If you are enjoying Cibo Libro and find it useful leave a tip to the
        developers to help continue development and show your apprecation.
      </SubHeader>

      <Link
        href="https://buy.stripe.com/28E8wObEx1pQ6sw8BxfEk00"
        target="_blank"
        className="flex mt-8"
      >
        <PrimaryButton width="w-full" size="lg">Leave a tip</PrimaryButton>
      </Link>
    </div>
  );
}
