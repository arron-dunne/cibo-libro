import { PrimaryButton } from "@/app/components/buttons/Buttons";
import { Header } from "@/app/components/text/Headers";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <Header>About</Header>

      <p className="mt-4">
        Hello! My name's Arron and i'm the developer behind Cibo Libro. This has
        been a passion project of mine and has gone through a lot of different
        forms before getting to here.
      </p>

      <p className="mt-4">
        Original it was Foodie built to help me develop as a web developer. I
        found it incredibly useful as a way to keep track of all my recipes in
        one place and I thought it would useful to other people too. So I
        decided to work on improving it. It changed into Cibo Libro as you see
        today.
      </p>

      <p className="mt-4">
        I have a lot of ideas how to make Cibo Libro even more useful in the
        future, and I'm excitied to see how it evolves. Please feel free to
        share your own thoughts and experience with Cibo Libro here.
      </p>

      <Header textSize="text-3xl" className="mt-8">
        Show Your Support
      </Header>

      <p className="mt-4">
        Cibo Libro is entirely a passion project and my goal it to make it as
        useful as possible at a lower-cost than alternatives.
      </p>
      
      <p className="mt-4">
        If you've enjoyed Cibo Libro and wish to support it development please
        consider leaving a tip to show youre appreciation and help support the
        future of Cibo Libro
      </p>

      <Link
        href="https://buy.stripe.com/28E8wObEx1pQ6sw8BxfEk00"
        target="_blank"
        className="flex mt-8"
      >
        <PrimaryButton type="button" width="w-full" size="lg">
          Leave a Tip
        </PrimaryButton>
      </Link>
    </div>
  );
}
