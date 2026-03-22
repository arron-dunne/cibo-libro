import Image from 'next/image'
import { Fraunces, Nunito } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })

export default function LandingPage() {
  return (
    <div className={`${nunito.className} min-h-screen text-zinc-900`}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-12 py-6">
        <Image src="/logo.png" alt="Cibo Libro" width={140} height={40} className="object-contain" />
        <div className="flex items-center gap-8 text-sm font-semibold text-zinc-500">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Login</a>
          <div className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white text-sm font-bold">
            Get started
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex items-center gap-12 px-12 pt-16 pb-20 min-h-[calc(100vh-80px)]">
        {/* Left: text */}
        <div className="flex-1 flex flex-col items-start">
          <div className="mb-5 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-500 text-sm font-semibold">
            Now in early access
          </div>
          <h1 className={`${fraunces.className} text-7xl font-bold text-rose-800 max-w-xl leading-tight`}>
            Your cookbook for the modern kitchen
          </h1>
          <p className="mt-6 text-xl text-zinc-500 max-w-md leading-relaxed">
            Save, organise, and cook from all your recipes in one beautiful place. Import from any website in seconds.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="px-7 py-3.5 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold text-base">
              Start for free
            </div>
            <div className="px-7 py-3.5 rounded-full border border-orange-300 text-orange-500 font-bold text-base">
              See how it works
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-400">No credit card required</p>
        </div>
        {/* Right: hero image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative rounded-4xl overflow-hidden shadow-2xl shadow-orange-200/60 border-4 border-orange-500/50">
            <Image src="/newhero.png" alt="Cibo Libro app" width={600} height={600} className="object-cover w-full max-w-lg block" />
            <div className="absolute inset-0 bg-linear-to-br from-orange-400/10 to-rose-400/10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-20">
        <h2 className={`${fraunces.className} text-4xl font-semibold text-center text-zinc-900 mb-4`}>
          Everything a food lover needs
        </h2>
        <p className="text-center text-zinc-500 mb-16 max-w-lg mx-auto">
          From a URL to a beautifully formatted recipe in seconds. Then cook, plan, and never lose a recipe again.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Import anything', body: "Paste a URL from any recipe site and we'll pull it in instantly — ingredients, steps, images, all of it." },
            { title: 'Cook mode', body: 'A focused, fullscreen view built for the kitchen. Step by step, hands-free, no distractions.' },
            { title: 'Always organised', body: 'Search, filter, and sort your entire collection in seconds. Your recipes, exactly when you need them.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <h3 className={`${fraunces.className} text-2xl font-semibold mb-3 text-zinc-900`}>{title}</h3>
              <p className="text-zinc-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-12 mb-20 rounded-3xl bg-linear-to-r from-orange-500 to-rose-500 px-16 py-16 flex items-center justify-between">
        <div>
          <h2 className={`${fraunces.className} text-4xl font-semibold text-white mb-2`}>
            Ready to get cooking?
          </h2>
          <p className="text-white/80 text-lg">Join thousands of home cooks already using Cibo Libro.</p>
        </div>
        <div className="px-8 py-4 rounded-full bg-white text-orange-500 font-bold text-base shrink-0">
          Create your cookbook
        </div>
      </section>

    </div>
  )
}
