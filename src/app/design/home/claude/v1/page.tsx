"use client";

import { useState } from 'react';
import { Plus, Clock, ChefHat, Search, Tag, ExternalLink } from 'lucide-react';

// Mock data for recipes
const recentRecipes = [
  {
    id: 1,
    title: "Lemon Garlic Roasted Chicken",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    tags: ["Dinner", "Poultry"],
    cookTime: "1h 15m",
    lastViewed: "2 days ago"
  },
  {
    id: 2,
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
    tags: ["Dinner", "Italian"],
    cookTime: "45m",
    lastViewed: "3 days ago"
  },
  {
    id: 3,
    title: "Blueberry Lemon Pancakes",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80",
    tags: ["Breakfast", "Sweet"],
    cookTime: "25m",
    lastViewed: "1 week ago"
  },
  {
    id: 4,
    title: "Thai Green Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    tags: ["Dinner", "Thai"],
    cookTime: "40m",
    lastViewed: "1 week ago"
  },
  {
    id: 5,
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
    tags: ["Dessert", "Baking"],
    cookTime: "30m",
    lastViewed: "2 weeks ago"
  },
  {
    id: 6,
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    tags: ["Lunch", "Salad"],
    cookTime: "15m",
    lastViewed: "2 weeks ago"
  }
];

const collections = [
  { name: "Dinner", count: 24 },
  { name: "Italian", count: 12 },
  { name: "Quick & Easy", count: 18 }
];

export default function Page() {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Cibo Libro
            </h1>
            <p className="text-white/90 text-sm mt-1">Your culinary collection</p>
          </div>
          
          <button className="bg-white/95 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 font-medium">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </header>

        {/* Hero Section - What's Cooking */}
        <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What's cooking today?
              </h2>
              <p className="text-gray-600 text-lg">
                Browse your collection or start something delicious
              </p>
            </div>
            
            <button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 font-semibold text-lg group">
              <ChefHat className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Cook Something
            </button>
          </div>

          {/* Quick Access Strip */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentRecipes.slice(0, 4).map((recipe) => (
                <button
                  key={recipe.id}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3] hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-white/80" />
                      <span className="text-white/80 text-xs">{recipe.cookTime}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Collections Preview */}
        <section className="grid md:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <button
              key={collection.name}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Tag className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">{collection.count}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">View collection →</p>
            </button>
          ))}
        </section>

        {/* Your Library */}
        <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
            <button className="text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-2">
              View All
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-3 shadow-md group-hover:shadow-2xl transition-all">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex gap-2">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 right-8 z-50">
          {showAddMenu && (
            <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 space-y-2 min-w-[200px] animate-in slide-in-from-bottom-2">
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-3 group">
                <ExternalLink className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-900">Paste a Link</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-3 group">
                <Plus className="w-5 h-5 text-orange-500 group-hover:rotate-90 transition-transform" />
                <span className="font-medium text-gray-900">Add Manually</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center group"
          >
            <Plus className={`w-8 h-8 transition-transform ${showAddMenu ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}