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
    <div className="h-screen flex">
      {/* Left: Image */}
      <div className="hidden md:block relative w-1/2 h-full">
        <Image
          src="https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e"
          alt="Dish"
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 text-3xl font-extrabold text-white drop-shadow-md">
          🍝 CookBook Hub
        </div>
      </div>

      {/* Right: Content */}
      <div className="w-full md:w-1/2 overflow-y-auto p-8 bg-orange-50">
        <h1 className="text-4xl font-bold mb-2">Spaghetti al Pomodoro</h1>
        <p className="text-gray-700 mb-6">
          A vibrant tomato pasta dish with garlic and basil.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <p><b>Prep:</b> 10m</p>
          <p><b>Cook:</b> 20m</p>
          <p><b>Total:</b> 30m</p>
          <p><b>Servings:</b> 2</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Steps</h2>
        <ol className="space-y-4">
          {steps.map((s, idx) => (
            <li key={idx} className="flex space-x-4">
              <span className="bg-orange-400 text-white rounded-lg px-3 py-1 font-bold">
                {idx + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
