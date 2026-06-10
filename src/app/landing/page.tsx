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
    <div className="px-10 sm:px-14 space-y-24">
      {/* Hero */}
      <section
        id="hero"
        className="w-full h-max md:h-[calc(100vh-80px)] pt-12 lg:pt-16 flex flex-col justify-between"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="p-0 md:pl-4 lg:pt-16 xl:pt-20 flex flex-col gap-6 justify-center lg:justify-start text-center lg:text-start">
            <Header textSize="text-5xl sm:text-6xl">
              All your recipes,<br/>none of the mess.
            </Header>
            <SubHeader className="mx-auto max-w-xl">
              Save recipes from across the web and add you own in your new digital cookbook.
              Skip the clutter and get straight to cooking.
            </SubHeader>
            <div className="w-full flex justify-center lg:justify-start gap-4 flex-wrap">
              <Link href="/register">
                <PrimaryButton type="button" size="lg">
                  Start for free
                </PrimaryButton>
              </Link>
              <Link href="#how-it-works">
                <SecondaryButton type="button" size="lg">
                  See how it works
                </SecondaryButton>
              </Link>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 shrink-0 pt-0 lg:pt-12 xl:pt-0">
            <Image
              src="/tmp4.png"
              alt="img"
              width={1000}
              height={1000}
              // className="rounded-[75] shadow-[0_10px_25px_rgba(255,105,0,0.25)]"
              />
            <div className="absolute bottom-5 -right-1 lg:-bottom-20 lg:right-10 rotate-0 lg:rotate-5 lg:h-100 w-50" >
              <Image
                src="/phone2.png"
                alt="phone"
                width={1000}
                height={1000}
                className="w-full h-full"
              />
              <div className="absolute top-2.5 left-2.5 h-95 w-45 rounded-2xl overflow-hidden">
                <Image
                  src="/ss2.png"
                  alt="phone"
                  width={832}
                  height={4198}
                  className="w-45 animate-phone-scroll"
                />
              </div>
              
            </div>
          </div>
        </div>
        <Divider />
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="w-full"
      >
        <div className="flex flex-col text-center items-center gap-4">
          <Header>What is CiboLibro?</Header>
          <SubHeader className="max-w-3xl">
            Your personal digital cookbook where you can store all of your
            recipes and easily search and filter through them so you skip the
            headaches and get straight to cooking.
          </SubHeader>
        </div>
        <div className="mt-12 md:mt-16 flex flex-col md:flex-row gap-12 md:gap-8 justify-center">
          <div className="flex-1 mx-auto max-w-sm bg-white/90 rounded-3xl p-10 shadow-2xl shadow-red-500/30 flex flex-col items-center">
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
            <p className="mt-6 text-slate-800 text-center">
              <b className="text-orange-600 font-extrabold">Import</b> recipes
              from hundreds of websites and{" "}
              <b className="text-orange-600 font-extrabold">add your own</b>{" "}
              with custom tags and notes.
            </p>
          </div>
          <div className="flex-1 mx-auto max-w-sm bg-white/90 shadow-2xl shadow-red-500/30 rounded-3xl p-10  flex flex-col items-center">
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
            <p className="mt-6 text-slate-800 text-center">
              <b className="text-orange-600 font-extrabold">Search sort</b>, and{" "}
              <b className="text-orange-600 font-extrabold">filter</b> your
              recipes to get cooking in no time. Use{" "}
              <b className="text-orange-600 font-extrabold">cook mode</b> to
              follow your recipes step by step.
            </p>
          </div>
          <div className="flex-1 mx-auto max-w-sm bg-white/90 rounded-3xl shadow-2xl shadow-red-500/30 p-10 flex flex-col items-center">
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
            <p className="mt-6 text-slate-800 text-center">
              <b className="text-orange-600 font-extrabold">
                No ads, no paywalls
              </b>{" "}
              and no clutter. Just your recipes, ready whenever you are.
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
        <Header>Loads more features are in the oven</Header>
        <SubHeader className="mt-4">
          Cibo Libro is just getting started. Join now to receive future early
          adopter benefits and help cook up the best cooking assistant.
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
          className="hidden md:block md:absolute -z-10 right-0 top-70 md:top-62 w-48 h-48 object-contain pointer-events-none"
        />
        <Image
          src="/icons/stove.png"
          alt="dough"
          width={400}
          height={400}
          className="hidden md:block md:absolute -z-10 left-0 bottom-30 w-48 h-48 object-contain pointer-events-none"
        />
      </section>

      <Divider />

      {/* CTA */}
      <section
        id="cta"
        className="w-full px-14 flex flex-col items-center text-center md:text-start"
      >
        <Header>Ready to get cooking?</Header>
        <SubHeader className="mt-6 mb-12 max-w-3xl text-center">
          Save and import hundreds of recipes, access them instantly, from
          anywhere, with no ads. Create your personal digital cookbook now for
          free.
        </SubHeader>
        <Link href="register">
          <PrimaryButton type="button" size="xl">
            Open your new cookbook
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

function Divider() {
  return <div className="w-full h-0.5 bg-linear-to-r from-orange-500 to-rose-500"/>
}
