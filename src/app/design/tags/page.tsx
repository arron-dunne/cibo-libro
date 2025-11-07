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
      <main className="relative flex flex-wrap gap-4 p-10 justify-center items-center min-h-screen">
        {/* Italian */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-orange-950 bg-gradient-to-r from-green-500 via-white to-red-500 border border-orange-200 shadow-sm flex items-center gap-1">
          🍝 Italian
        </span>

        {/* Vegan */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-green-900 bg-green-100 border border-green-200 shadow-sm flex items-center gap-1">
          🌱 Vegan
        </span>

        {/* Dinner */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-orange-950 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 border border-orange-200 shadow-sm flex items-center gap-1">
          🍽️ Dinner
        </span>

        {/* Dessert */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-pink-900 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 border border-pink-200 shadow-sm flex items-center gap-1">
          🍰 Dessert
        </span>

        {/* Spicy */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-red-900 bg-gradient-to-r from-red-200 via-red-300 to-orange-200 border border-red-300 shadow-sm flex items-center gap-1">
          🌶️ Spicy
        </span>

        {/* Quick */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-yellow-900 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 border border-yellow-200 shadow-sm flex items-center gap-1">
          ⚡ Quick
        </span>

        {/* Healthy */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-emerald-900 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 border border-emerald-200 shadow-sm flex items-center gap-1">
          🥗 Healthy
        </span>

        {/* Breakfast */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-yellow-800 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 border border-yellow-200 shadow-sm flex items-center gap-1">
          ☀️ Breakfast
        </span>

        {/* Generic fallback */}
        <span className="px-4 py-2 rounded-full text-sm font-semibold text-orange-900 bg-white/70 backdrop-blur-sm border border-orange-200 shadow-sm flex items-center gap-1">
          Generic Tag
        </span>
      </main>
    </>
  );
}
