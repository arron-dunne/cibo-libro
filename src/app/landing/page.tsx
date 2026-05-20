import Image from "next/image";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "../components/text/Headers";
import { Calendar, Camera, GraduationCap, Icon, ShoppingBasket, UsersRound } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
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
            <SecondaryButton>Login</SecondaryButton>
            <PrimaryButton>Get Started</PrimaryButton>
          </div>
        </div>
        <div className="mt-20 w-full flex gap-12">
          <div className="my-auto space-y-8">
            <Header textSize="text-6xl">
              Your cookbook for the modern kitchen
            </Header>
            <SubHeader>
              Save, organise, and cook from all your recipes in one beautiful
              place. Import from any website in seconds.
            </SubHeader>
            <div className="flex gap-4">
              <PrimaryButton size="lg">Start for free</PrimaryButton>
              <SecondaryButton size="lg">See how it works</SecondaryButton>
            </div>
          </div>
          <Image
            src="/newhero.png"
            alt="img"
            width={1000}
            height={1000}
            className="w-150 mr-20 shrink-0 rounded-[80] shadow-[0_10px_25px_rgba(255,105,0,0.25)]"
          />
        </div>
      </div>

      {/* How it works */}
      <div className="w-full border-t border-rose-500 min-h-screen py-20 px-14">
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
      </div>

      {/* Features */}
      <div className="w-full py-20 px-40 relative border-t border-rose-500">
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
              {/* <span className="w-3 h-3 rounded-full bg-linear-to-r from-orange-500 to-rose-500 shrink-0" /> */}
              {feature.Icon && (
                <div className="rounded-xl px-2 py-2 bg-linear-to-br from-orange-500 to-rose-500 text-white">
                  <feature.Icon />
                </div>
              )}
              <span className="text-xl bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent font-extrabold tracking-wide">{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pr-6 flex justify-end items-center gap-3 text-lg">
          <span className="text-gray-700">What would you love to see?</span>
          <span className="text-orange-500 font-semibold">
            Request a feature
          </span>
        </div>
        <Image
          src="/icons/dough.png"
          alt="dough"
          width={400}
          height={400}
          className="absolute right-45 top-60 w-48 h-48 object-contain pointer-events-none"
        />
      </div>
      {/* CTA / Register */}
      <div className="w-full bg-rose-50 py-24 px-14 flex flex-col items-center">
        <h2 className={`text-4xl font-bold text-rose-600 text-center`}>
          Ready to get cooking?
        </h2>
        <p className="mt-4 text-gray-500 text-center max-w-sm">
          Save hundreds of recipes, completely free with no ads. Start your
          personal digital cookbook now
        </p>
        <div className="mt-10 flex flex-col gap-6 w-full max-w-xs">
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-lg">Email</label>
            <input
              type="email"
              className="w-full bg-white rounded-2xl px-5 py-4 border border-rose-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-lg">Password</label>
            <input
              type="password"
              className="w-full bg-white rounded-2xl px-5 py-4 border border-rose-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-900 text-lg">Confirm Password</label>
            <input
              type="password"
              className="w-full bg-white rounded-2xl px-5 py-4 border border-rose-200"
            />
          </div>
          <button className="w-full mt-2 bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold text-lg py-4 rounded-full hover:brightness-90 active:brightness-75 transition-all">
            Create account
          </button>
        </div>
        <div className="mt-10 flex items-center gap-3 text-base">
          <span className="text-gray-500">Still not sure how it works?</span>
          <span className="text-rose-500 font-semibold underline underline-offset-2 cursor-pointer">
            Explore a demo cookbook to learn more
          </span>
        </div>
      </div>
    </div>
  );
}
