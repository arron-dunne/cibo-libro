import Image from "next/image";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";
import {
  Calendar,
  Camera,
  ChevronRight,
  GraduationCap,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="px-10 sm:px-14 space-y-16 lg:space-y-24">
      <section
        id="hero"
        className="w-full h-max lg:h-[calc(100vh-80px)] pt-12 lg:pt-16 flex flex-col justify-between"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="p-0 md:pl-4 lg:pt-16 xl:pt-20 flex flex-col gap-4 sm:gap-6 justify-center lg:justify-start text-center lg:text-start">
            {/* Header */}
            <Header textSize="text-5xl sm:text-6xl" className="leading-tight">
              All your recipes,
              <br />
              none of the mess.
            </Header>

            {/* Subheader */}
            <SubHeader
              textSize="text-base sm:text-lg"
              className="mx-auto max-w-xl leading-relaxed"
            >
              Import recipes from anywhere, create your own, find everything
              instantly, and cook without distractions.
            </SubHeader>

            {/* Buttons */}
            <div className="w-full flex justify-center lg:justify-start gap-4 flex-wrap">
              <Link href="/register">
                <PrimaryButton
                  type="button"
                  size="md"
                  className="sm:px-5 sm:py-3 sm:text-xl"
                >
                  Start for free
                </PrimaryButton>
              </Link>
              <Link href="#how-it-works">
                <SecondaryButton
                  type="button"
                  size="md"
                  className="sm:px-5 sm:py-3 sm:text-xl"
                >
                  See how it works
                </SecondaryButton>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full lg:w-1/2 max-w-xl lg:max-w-none shrink-0 pt-0 lg:pt-12 xl:pt-0">
            <Image
              src="/landing-main.png"
              alt="main"
              width={6239}
              height={5017}
            />
          </div>
        </div>
        <Divider className="mt-16 lg:mt-0" />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="w-full">
        <div className="flex flex-col text-center items-center gap-4">
          <Header textSize="text-4xl sm:text-5xl" className="leading-tight">
            Find on the web,
            <br className="lg:hidden" /> serve on the table.
          </Header>
          <SubHeader textSize="text-base sm:text-lg" className="px-4 max-w-3xl">
            Here&apos;s how it works...
          </SubHeader>
        </div>
        <div className="mt-12 md:mt-16 flex flex-col lg:flex-row gap-12 lg:gap-8 justify-center [&_b]:text-orange-600 [&_b]:font-extrabold">
          <div className="flex-1 mx-auto max-w-sm bg-white/90 rounded-3xl p-10  flex flex-col items-center">
            <Image
              src="/icons/salad.png"
              alt="Gather"
              width={200}
              height={200}
              className="w-24 h-24 object-contain"
            />

            <div className="mt-6 flex gap-4 items-center">
              <div className="rounded-full w-8 h-8 bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold flex justify-center items-center">
                1
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Gather</h3>
            </div>
            <p className="mt-6 text-slate-900 font-medium text-center">
              <b>Import</b> recipes from hundreds of websites and{" "}
              <b>add your own</b> with custom tags and notes.
            </p>
          </div>
          <div className="flex-1 mx-auto max-w-sm bg-white/90  rounded-3xl p-10  flex flex-col items-center">
            <Image
              src="/icons/cooking.png"
              alt="Cook"
              width={200}
              height={200}
              className="w-24 h-24 object-contain"
            />
            <div className="mt-6 flex gap-4 items-center">
              <div className="rounded-full w-8 h-8 bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold flex justify-center items-center">
                2
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Cook</h3>
            </div>
            <p className="mt-6 text-slate-900 font-medium text-center">
              <b>Find</b> any recipe in seconds, then let <b>cook mode</b> guide
              you through step by step.
            </p>
          </div>
          <div className="flex-1 mx-auto max-w-sm bg-white/90 rounded-3xl p-10 flex flex-col items-center">
            <Image
              src="/icons/food.png"
              alt="Enjoy"
              width={200}
              height={200}
              className="w-24 h-24 object-contain"
            />
            <div className="mt-6 flex gap-4 items-center">
              <div className="rounded-full w-8 h-8 bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold flex justify-center items-center">
                3
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Enjoy</h3>
            </div>
            <p className="mt-6 text-slate-900 font-medium text-center">
              Every recipe at your fingertips, completely <b>free</b> and{" "}
              <b>with no ads</b>.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* Features */}
      <section
        id="features"
        className="max-w-4xl mx-auto w-full relative text-center md:text-start"
      >
        <Header textSize="text-4xl sm:text-5xl">
          We&apos;re cooking up something good.
        </Header>
        <SubHeader textSize="text-base sm:text-lg" className="mt-4">
          Cibo Libro is just getting started. Early adopters are first in line
          for everything we&apos;re building.
        </SubHeader>
        <div className="flex mt-12 flex-col gap-4">
          {[
            {
              text: "Shopping List",
              Icon: ShoppingBasket,
            },
            {
              text: "Meal planner",
              Icon: Calendar,
            },
            {
              text: "More ways to import",
              Icon: Camera,
            },
            {
              text: "Cooking courses",
              Icon: GraduationCap,
            },
            {
              text: "Share your recipes",
              Icon: UsersRound,
            },
            {
              text: "And more...",
            },
          ].map((feature, i) => (
            <div
              key={feature.text}
              className="bg-white/90 rounded-2xl px-4 py-4 flex items-center gap-4 w-full max-w-md"
              style={{
                marginLeft: `max(0px, calc((100% - 28rem) / 5 * ${i}))`,
              }}
            >
              {feature.Icon && (
                <div className="rounded-xl px-2 py-2 bg-linear-to-br from-orange-500 to-rose-500 text-white">
                  <feature.Icon />
                </div>
              )}
              <span className="text-xl text-slate-800 font-bold">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 sm:mt-2 w-full flex justify-end">
          <div className="w-md px-2 flex flex-col sm:flex-row gap-0 md:gap-2 items-center justify-between text-lg">
            <SubHeader>What would you love to see?</SubHeader>
            <Link href="/support/feedback">
              <TertiaryButton type="button">Request a feature</TertiaryButton>
            </Link>
          </div>
        </div>
        <Image
          src="/icons/dough.png"
          alt="dough"
          width={400}
          height={400}
          className="hidden lg:block lg:absolute -z-10 right-0 top-38 w-48 h-48 object-contain pointer-events-none"
        />
        <Image
          src="/icons/stove.png"
          alt="dough"
          width={400}
          height={400}
          className="hidden lg:block lg:absolute -z-10 left-0 bottom-8 w-44 h-44 object-contain pointer-events-none"
        />
      </section>

      <Divider />

      {/* CTA */}
      <section
        id="cta"
        className="w-full flex flex-col items-center text-center md:text-start"
      >
        <Header textSize="text-4xl sm:text-5xl">Ready to get cooking?</Header>
        <Link className="mt-10 mb-12" href="register">
          <PrimaryButton
            type="button"
            size="lg"
            className="sm:px-9 sm:py-5 sm:text-2xl"
          >
            Create your free cookbook
            <ChevronRight size={30} />
          </PrimaryButton>
        </Link>
        {/* <div className="mt-16 flex flex-col md:flex-row gap-0 md:gap-3 items-center text-base">
          <SubHeader>Still not sure how it works?</SubHeader>
          <TertiaryButton type="button">
            Explore a demo cookbook to learn more
          </TertiaryButton>
        </div> */}
      </section>
    </div>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`${className} w-full h-0.5 bg-linear-to-r from-orange-500 to-rose-500`}
    />
  );
}
