"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Circle } from "lucide-react";

export default function ClientRecipe() {
  const [checked, setChecked] = useState<string[]>([]);

  const toggleCheck = (item: string) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const ingredients = [
    "200g spaghetti",
    "2 cloves garlic",
    "400g canned tomatoes",
    "2 tbsp olive oil",
    "Fresh basil leaves",
    "Salt & pepper",
  ];

  const steps = [
    "Bring salted water to a boil and cook spaghetti until al dente.",
    "Heat olive oil in a pan, sauté garlic until fragrant.",
    "Add canned tomatoes, simmer for 10 minutes, season with salt & pepper.",
    "Drain spaghetti and toss in the sauce.",
    "Garnish with fresh basil and serve hot.",
  ];

  return (
    <div className="relative min-h-screen bg-neutral-50 text-neutral-800">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <Image
          src="https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?fit=crop&w=1600&q=80"
          alt="Spaghetti"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-bold text-center drop-shadow-lg">
            Spaghetti al Pomodoro
          </h1>
        </div>
      </div>

      {/* At-a-glance bar */}
      <div className="flex justify-around items-center py-4 bg-white shadow-md sticky top-0 z-10">
        <div>
          <span className="font-bold">Prep:</span> 10 min
        </div>
        <div>
          <span className="font-bold">Cook:</span> 20 min
        </div>
        <div>
          <span className="font-bold">Total:</span> 30 min
        </div>
        <div>
          <span className="font-bold">Servings:</span> 2
        </div>
      </div>

      {/* Ingredients */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Ingredients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ingredients.map((item) => (
            <div
              key={item}
              onClick={() => toggleCheck(item)}
              className="flex items-center space-x-3 cursor-pointer"
            >
              {checked.includes(item) ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Circle className="text-gray-400" />
              )}
              <span
                className={`${
                  checked.includes(item) ? "line-through text-gray-400" : ""
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider Image */}
      <div className="w-full h-72 relative my-12">
        <Image
          src="https://images.unsplash.com/photo-1606788075761-17c33a7eaa5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Cooking sauce"
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Steps Timeline */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Steps</h2>
        <ol className="relative border-l-2 border-orange-300">
          {steps.map((step, idx) => (
            <li key={idx} className="mb-10 ml-6">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-orange-400 rounded-full text-white font-bold">
                {idx + 1}
              </span>
              <p className="text-lg leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer Save Button */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex justify-center">
        <button className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-orange-600 transition">
          Save to Cookbook
        </button>
      </div>
    </div>
  );
}
