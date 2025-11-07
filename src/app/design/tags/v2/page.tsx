"use client"

export default async function Page() {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />

      {/* Rest of page */}
      <main className="relative flex flex-wrap gap-6 p-12 justify-center items-center min-h-screen">
        
        {/* Italian — blurred flag tilt */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-orange-950 flex items-center gap-1.5 shadow-md border border-orange-200 backdrop-blur-lg bg-[linear-gradient(65deg,#008C45_0%,#008C45_33%,#F4F5F0_33%,#F4F5F0_66%,#CD212A_66%,#CD212A_100%)]">
          <span className="text-lg">🍝</span> Italian
        </span>

        {/* Vegan */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-green-900 flex items-center gap-1.5 shadow-md border border-green-200 bg-gradient-to-br from-green-100 via-emerald-200 to-green-300 hover:brightness-105 transition">
          <span className="text-lg">🌱</span> Vegan
        </span>

        {/* Dinner */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-orange-950 flex items-center gap-1.5 shadow-md border border-orange-200 bg-gradient-to-br from-amber-100 via-orange-200 to-orange-300 hover:brightness-105 transition">
          <span className="text-lg">🍽️</span> Dinner
        </span>

        {/* Dessert */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-pink-900 flex items-center gap-1.5 shadow-md border border-pink-200 bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 hover:brightness-105 transition">
          <span className="text-lg">🍰</span> Dessert
        </span>

        {/* Spicy */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-red-900 flex items-center gap-1.5 shadow-md border border-red-200 bg-gradient-to-br from-red-200 via-orange-300 to-rose-200 hover:brightness-110 transition">
          <span className="text-lg">🌶️</span> Spicy
        </span>

        {/* Quick */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-yellow-900 flex items-center gap-1.5 shadow-md border border-yellow-200 bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-300 hover:brightness-110 transition">
          <span className="text-lg">⚡</span> Quick
        </span>

        {/* Healthy */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-emerald-900 flex items-center gap-1.5 shadow-md border border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-200 to-green-300 hover:brightness-110 transition">
          <span className="text-lg">🥗</span> Healthy
        </span>

        {/* Breakfast */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-amber-900 flex items-center gap-1.5 shadow-md border border-yellow-200 bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-200 hover:brightness-105 transition">
          <span className="text-lg">☀️</span> Breakfast
        </span>

        {/* Generic Fallback */}
        <span className="px-5 py-2.5 rounded-full text-sm font-semibold text-orange-900 flex items-center gap-1.5 shadow-md border border-orange-200 bg-white/60 backdrop-blur-md hover:brightness-105 transition">
          Generic Tag
        </span>
      </main>
    </>
  );
}
