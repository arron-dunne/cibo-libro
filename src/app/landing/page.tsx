import Image from "next/image";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";
import { Calendar, Camera, ChevronRight, GraduationCap, ShoppingBasket, UsersRound } from "lucide-react";
import { Footer } from "../components/footer/Footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      <div className="relative w-full h-screen pt-8 px-14">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center">
          <Image
            src="/logo.png"
            alt="cibo libro"
            width={150}
            height={36}
            className="h-12 w-auto"
            priority
            />
          <div className="flex gap-4 h-max">
            <Link href="/login">
              <SecondaryButton>Login</SecondaryButton>
            </Link>
            <Link href="/register">
              <PrimaryButton>Get Started</PrimaryButton>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section id="hero" className="mt-20 w-full flex gap-12">
          <div className="my-auto space-y-8">
            <Header textSize="text-6xl">
              Your cookbook for the modern kitchen
            </Header>
            <SubHeader>
              Save, organise, and cook from all your recipes in one beautiful
              place. Import from any website in seconds.
            </SubHeader>
            <div className="flex gap-4">
              <Link href="/register">
                <PrimaryButton size="lg">Start for free</PrimaryButton>
              </Link>
              <Link href="#how-it-works">
                <SecondaryButton size="lg">See how it works</SecondaryButton>
              </Link>
            </div>
          </div>
          <Image
            src="/newhero.png"
            alt="img"
            width={1000}
            height={1000}
            className="w-150 mr-20 shrink-0 rounded-[80] shadow-[0_10px_25px_rgba(255,105,0,0.25)]"
          />
        </section>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="w-full border-t border-rose-500 min-h-screen py-20 px-20">
        <div className="flex flex-col items-center gap-4">
          <Header>What is CiboLibro?</Header>
          <SubHeader className="max-w-3xl text-center">
            Your personal digital cookbook where you can store all of your
            recipes and easily search and filter through them so you skip the
            headaches and get straight to cooking.
          </SubHeader>
        </div>
        <div className="mt-16 flex gap-8 justify-center">
          <div className="flex-1 max-w-sm bg-white rounded-3xl p-10 shadow-2xl shadow-red-500/30 flex flex-col items-center">
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
            <p className="mt-6 text-slate-500 text-center">
              <b className="text-orange-600 font-extrabold">Import</b> recipes
              from hundreds of websites and{" "}
              <b className="text-orange-600 font-extrabold">add your own</b>{" "}
              with custom tags and notes.
            </p>
          </div>
          <div className="flex-1 max-w-sm bg-white shadow-2xl shadow-red-500/30 rounded-3xl p-10  flex flex-col items-center">
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
            <p className="mt-6 text-slate-500 text-center">
              <b className="text-orange-600 font-extrabold">Search sort</b>, and{" "}
              <b className="text-orange-600 font-extrabold">filter</b> your
              recipes to get cooking in no time. Use{" "}
              <b className="text-orange-600 font-extrabold">cook mode</b> to
              follow your recipes step by step.
            </p>
          </div>
          <div className="flex-1 max-w-sm bg-white rounded-3xl shadow-2xl shadow-red-500/30 p-10 flex flex-col items-center">
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
            <p className="mt-6 text-slate-500 text-center">
              <b className="text-orange-600 font-extrabold">
                No ads, no paywalls
              </b>{" "}
              and no clutter. Just your recipes, ready whenever you are.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-20 px-40 relative border-t border-rose-500">
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
              Icon: Calendar
            },
            {
              text: "More ways to import",
              Icon: Camera
            },
            {
              text: "Cooking courses",
              Icon: GraduationCap

            },
            {
              text: "Share your recipes with others",
              Icon: UsersRound
            },
            {
              text: "And many more...",
            },
          ].map((feature, i) => (
            <div
              key={feature.text}
              className="bg-white rounded-2xl px-4 py-4 flex items-center gap-6 w-md"
              style={{ marginLeft: `calc((100% - 28rem) / 5 * ${i})` }}
            >
              {feature.Icon && (
                <div className="rounded-xl px-2 py-2 bg-linear-to-br from-orange-500 to-rose-500 text-white">
                  <feature.Icon />
                </div>
              )}
              <span className="text-xl bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent font-extrabold tracking-wide">{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 w-full flex justify-end">
          <div className="w-md px-2 flex gap-2 justify-between text-lg">
            <SubHeader>
              What would you love to see?
            </SubHeader>
            <Link href="/request">
              <TertiaryButton>
                Request a feature
              </TertiaryButton>
            </Link>
          </div>
        </div>
        <Image
          src="/icons/dough.png"
          alt="dough"
          width={400}
          height={400}
          className="absolute right-50 top-62 w-48 h-48 object-contain pointer-events-none"
        />
        <Image
          src="/icons/stove.png"
          alt="dough"
          width={400}
          height={400}
          className="absolute left-45 bottom-30 w-48 h-48 object-contain pointer-events-none"
        />
      </section>

      {/* CTA / Register */}
      <section id="cta" className="w-full border-t border-rose-500 py-24 px-14 flex flex-col items-center">
        <Header>Ready to get cooking?</Header>
        <SubHeader className="mt-6 mb-12 max-w-3xl text-center">
          Save and import hundreds of recipes, access them instantly, from anywhere, with no ads. Create your
          personal digital cookbook now for free.
        </SubHeader>
        <Link href="register">
          <PrimaryButton size="xl">
            Open you personal cookbook
            <ChevronRight size={30}/>
          </PrimaryButton>
        </Link>
        <div className="mt-16 flex items-center gap-3 text-base">
          <span className="text-slate-500">Still not sure how it works?</span>
          <TertiaryButton>
            Explore a demo cookbook to learn more
          </TertiaryButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
