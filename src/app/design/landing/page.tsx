import { PrimaryButton, SecondaryButton } from '@/app/components/page';
import { Libre_Baskerville, Nunito, Oregano, Kavoon } from 'next/font/google';
import Image from 'next/image';

const nunito = Nunito({ subsets: ['latin'] });

export default function LandingPage() {
  return (
    <div className={nunito.className}>
      {/* Hero */}
      <div className="relative w-full h-screen bg-[#FFEEE3] pt-8 px-14">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center">
          <div className="w-40 h-12 bg-orange-200 flex justify-center items-center">Logo</div>
          <div className="flex gap-4 h-max">
            <SecondaryButton text="Login" />
            <PrimaryButton text="Get Started" />
          </div>
        </div>
        <div className="mt-20 w-full flex gap-12">
          <div>
            <h1 className={`${nunito.className} mt-20 font-bold text-6xl text-rose-600`}>
              Your cookbook for the modern kitchen
            </h1>
            <p className="mt-8 text-lg text-gray-600">
              Save, organise, and cook from all your recipes in one beautiful place. Import from any
              website in seconds.
            </p>
            <div className="mt-8 flex gap-4">
              <PrimaryButton text="Start for free" />
              <SecondaryButton text="See how it works" />
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
      <div className="w-full min-h-screen bg-red-100 py-20 px-14">
        <h2 className={`${nunito.className} text-4xl font-bold text-rose-600 text-center`}>
          What is CiboLibro?
        </h2>
        <div className="mt-16 flex gap-8 justify-center">
          <div className="flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-300 flex flex-col items-center">
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
            <p className="mt-6 text-gray-700 text-center">
              <b>Import</b> recipes from anywhere in seconds and <b>add your own</b> to your
              personal cookbook so you never lose a recipe again.
            </p>
          </div>
          <div className="flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-300 flex flex-col items-center">
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
            <p className="mt-6 text-gray-700 text-center">
              <b>Search</b>, <b>sort</b>, and <b>filter</b> your recipes to get cooking in no time.
              Use <b>Cook Mode</b> to follow recipes step-by-step at the stove.
            </p>
          </div>
          <div className="flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-300 flex flex-col items-center">
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
            <p className="mt-6 text-gray-700 text-center">
              <b>No ads</b>, <b>no paywalls</b> and no clutter. Just your recipes, ready whenever you are.
            </p>
          </div>
        </div>
      </div>
      {/* Features */}
      <div className="w-full bg-[#FFEEE3] py-20 px-40 relative">
        <h2 className={`${nunito.className} text-4xl font-bold text-rose-600`}>
          Loads more features are in the oven
        </h2>
        <p className="mt-6 text-lg text-gray-700">
          Cibo Libro is just getting started. Join now to be an early adopter and request future
          features.
        </p>
        <div className="flex mt-12 flex-col gap-4">
          {[
            'Shopping List',
            'Meal planner',
            'More ways to import',
            'Cooking courses',
            'Share your recipes with others',
            'And many more...',
          ].map((feature, i) => (
            <div
              key={feature}
              className="bg-white rounded-2xl px-8 py-4 flex items-center gap-4 w-md border border-orange-200"
              style={{ marginLeft: `calc((100% - 28rem) / 5 * ${i})` }}
            >
              <span className="w-3 h-3 rounded-full bg-orange-500 underline shrink-0" />
              <span className="text-2xl text-gray-900">{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pr-6 flex justify-end items-center gap-3 text-lg">
          <span className="text-gray-700">What would you love to see?</span>
          <span className="text-orange-500 font-semibold">Request a feature</span>
        </div>
        <Image
          src="/icons/dough.png"
          alt="dough"
          width={400}
          height={400}
          className="absolute right-32 top-2/5 -translate-y-1/2 w-56 h-56 object-contain pointer-events-none"
        />
      </div>
      {/* CTA / Register */}
      <div className="w-full bg-rose-50 py-24 px-14 flex flex-col items-center">
        <h2 className={`${nunito.className} text-4xl font-bold text-rose-600 text-center`}>
          Ready to get cooking?
        </h2>
        <p className="mt-4 text-gray-500 text-center max-w-sm">
          Save hundreds of recipes, completely free with no ads. Start your personal digital
          cookbook now
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
