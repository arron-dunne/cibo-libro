import { PrimaryButton, SecondaryButton } from '@/app/components/page';
import { Libre_Baskerville, Nunito } from 'next/font/google'
import Image from 'next/image';

const lb = Libre_Baskerville({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })

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
            <h1 className={`${lb.className} mt-20 text-6xl font-bold text-rose-800`}>Your cookbook for the modern kitchen</h1>
            <p className='mt-8 text-lg text-gray-700'>Save, organise, and cook from all your recipes in one beautiful place. Import from any website in seconds.</p>
            <div className='mt-8 flex gap-4'>
              <PrimaryButton text='Start for free' />
              <SecondaryButton text='See how it works' />
            </div>
          </div>
          <Image src="/newhero.png" alt="img" width={1000} height={1000} className='w-150 mr-20 shrink-0 rounded-[100] shadow-[0_10px_25px_rgba(255,105,0,0.25)]'/>
          <Image src="/phone.png" alt="img" width={1000} height={1000} className='absolute -right-16 -bottom-40 w-125 shrink-0'/>
        </div>
      </div>
      {/* How it works */}
      <div className='w-full min-h-screen bg-red-100 py-20 px-14'>
        <h2 className={`${lb.className} text-4xl font-bold text-rose-800 text-center`}>How it works</h2>
        <div className='mt-16 flex gap-8 justify-center'>
          <div className='flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-100 flex flex-col items-center'>
            <Image src='/icons/salad.png' alt='Gather' width={200} height={200} className='w-40 h-40 object-contain' />
            <h3 className='mt-6 text-2xl font-bold text-gray-900'>Gather</h3>
            <p className='mt-6 text-gray-700 text-center'>Import recipes from anywhere and add your own to your personal cookbook. Never lose a recipe again.</p>
          </div>
          <div className='flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-100 flex flex-col items-center'>
            <Image src='/icons/cooking.png' alt='Cook' width={200} height={200} className='w-40 h-40 object-contain' />
            <h3 className='mt-6 text-2xl font-bold text-gray-900'>Cook</h3>
            <p className='mt-6 text-gray-700 text-center'>Search, sort, and filter your recipes to get cooking in no time.</p>
          </div>
          <div className='flex-1 max-w-sm bg-white rounded-3xl p-10 border border-rose-100 flex flex-col items-center'>
            <Image src='/icons/food.png' alt='Enjoy' width={200} height={200} className='w-40 h-40 object-contain' />
            <h3 className='mt-6 text-2xl font-bold text-gray-900'>Enjoy</h3>
            <p className='mt-6 text-gray-700 text-center'>No ads, no paywalls, no clutter. Just your recipes, ready whenever you are.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
