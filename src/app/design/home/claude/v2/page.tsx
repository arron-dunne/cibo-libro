"use client";
import { useState } from 'react';
import { Plus, Clock, ChefHat, Search, Tag, ExternalLink, LogOut, BookOpen, Upload, PlusCircle, Settings, Utensils, Pizza, Coffee, Salad, Soup, Cookie, Fish, Beef } from 'lucide-react';

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

const tagOptions = [
  { name: "Italian", icon: Pizza, color: "from-red-400 to-orange-400", count: 12 },
  { name: "Breakfast", icon: Coffee, color: "from-amber-400 to-yellow-400", count: 8 },
  { name: "Dinner", icon: Utensils, color: "from-orange-400 to-rose-400", count: 24 },
  { name: "Dessert", icon: Cookie, color: "from-pink-400 to-rose-400", count: 15 },
  { name: "Salad", icon: Salad, color: "from-green-400 to-emerald-400", count: 9 },
  { name: "Soup", icon: Soup, color: "from-orange-300 to-amber-400", count: 7 },
  { name: "Seafood", icon: Fish, color: "from-blue-400 to-cyan-400", count: 11 },
  { name: "Meat", icon: Beef, color: "from-red-500 to-orange-500", count: 18 },
];

export default function Page() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Floating Navbar */}
      <nav className="sticky top-4 z-40 mx-4 md:mx-8 mb-6">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent hidden sm:inline">
                Cibo Libro
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <BookOpen className="w-4 h-4" />
                Recipes
              </button>
              <button className="px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <PlusCircle className="w-4 h-4" />
                Add
              </button>
              <button className="px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            {/* Logout Button */}
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 font-medium">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="md:hidden flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 overflow-x-auto">
            <button className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium whitespace-nowrap">
              <BookOpen className="w-4 h-4" />
              Recipes
            </button>
            <button className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium whitespace-nowrap">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium whitespace-nowrap">
              <PlusCircle className="w-4 h-4" />
              Add
            </button>
            <button className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium whitespace-nowrap">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </nav>

      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
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

          {/* Search & Filter Section */}
          <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Find Your Recipe</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes by name or ingredient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Tag Pills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Browse by Category
              </h4>
              <div className="flex flex-wrap gap-3">
                {tagOptions.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <button
                      key={tag.name}
                      className={`group relative overflow-hidden rounded-full px-5 py-3 bg-gradient-to-r ${tag.color} hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span className="font-semibold text-white text-sm">
                        {tag.name}
                      </span>
                      <span className="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs text-white font-bold">
                        {tag.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
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
        </div>
      </div>

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
  );
}