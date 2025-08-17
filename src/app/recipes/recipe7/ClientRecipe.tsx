"use client";

import Image from "next/image";

export default function ClientRecipe() {
  const steps = [
    "Boil pasta until al dente.",
    "Sauté garlic in olive oil.",
    "Add tomatoes, simmer & season.",
    "Toss spaghetti with sauce.",
    "Top with basil & serve.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Navbar */}
      <nav className="flex justify-between px-6 py-4 bg-purple-600 text-white font-bold shadow-lg">
        <div>🍝 Playful Kitchen</div>
        <div className="space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Recipes</a>
          <a href="#" className="hover:underline">Profile</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-64 md:h-96">
        <Image
          src="https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e"
          alt="Dish"
          fill
          className="object-cover rounded-b-3xl"
        />
      </div>

      {/* Content cards */}
      <div className="max-w-3xl mx-auto -mt-12 space-y-8 px-4">
        {/* Card: Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2">Spaghetti al Pomodoro</h1>
          <p className="text-gray-600">A timeless Italian classic made simple and delicious.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 text-center mt-4">
            <p><b>Prep:</b> 10m</p>
            <p><b>Cook:</b> 20m</p>
            <p><b>Total:</b> 30m</p>
            <p><b>Servings:</b> 2</p>
          </div>
        </div>

        {/* Card: Steps */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <ol className="space-y-3">
            {steps.map((s, idx) => (
              <li key={idx} className="flex space-x-3">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
