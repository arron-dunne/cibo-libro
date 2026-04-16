import { PrimaryButton, SecondaryButton } from '@/app/components/page';
import { Libre_Baskerville, Nunito } from 'next/font/google'
import Image from 'next/image';

const lb = Libre_Baskerville({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })

const steps = [
  {
    heading: 'Gather',
    body: 'Import recipes from any URL or add your own by hand. Every dish you love, saved in one place.',
  },
  {
    heading: 'Cook',
    body: 'Search, sort, and filter your collection in seconds. A focused cook mode walks you through each step at the stove.',
  },
  {
    heading: 'Enjoy',
    body: 'No ads, no paywalls, no clutter. Just your recipes, ready whenever you are.',
  },
]

export default function MobileLandingPage() {
  return (
    <div className={`${nunito.className} max-w-md mx-auto bg-[#FFEEE3] min-h-screen overflow-hidden`}>
      <div className="flex flex-col gap-6 px-4 py-8">
        {/* Hero */}
        <div className="bg-white rounded-3xl px-5 py-8 shadow-sm">
          <div className="mx-auto w-60 h-16 bg-orange-300 flex items-center justify-center">Logo</div>
          <h1 className={`${lb.className} mt-8 text-4xl text-center font-bold text-rose-700`}>Your cookbook for the modern kitchen</h1>
          <p className='mt-4 text-center text-gray-700'>Save, organise and cook from all your recipes in one place. Import from any website in seconds.</p>

          <div className='mt-6 flex gap-4 justify-center'>
            <PrimaryButton text="Start for free" />
            <SecondaryButton text="See how it works" />
          </div>

          <div className="mt-6">
            <Image className="rounded-3xl" src="/newhero.png" width={1000} height={1000} alt="img" />
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-3xl px-6 py-12 shadow-sm">
          <h2 className={`${lb.className} text-3xl text-center font-bold text-rose-700`}>How it works</h2>
          <p className="mt-3 text-center text-gray-600">From pantry to plate, in three simple steps.</p>

          <div className="mt-12 flex flex-col gap-14">
            {steps.map(({ heading, body }) => (
              <div key={heading} className="text-center">
                <h3 className={`${lb.className} text-3xl font-bold text-rose-700`}>{heading}</h3>
                <p className="mt-4 text-gray-700 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
