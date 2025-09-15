// Version 5: Full Screen Immersive Design
export default function CookModeV5() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Overlay Header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="bg-black bg-opacity-70 text-white p-3 flex justify-between items-center">
          <button className="text-2xl p-2">← Exit</button>
          <h1 className="text-xl">Classic Carbonara</h1>
          <div className="flex items-center">
            <span className="text-green-400 mr-1">●</span>
            <span>Awake</span>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-16">
        <div className="max-w-2xl">
          <p className="text-4xl md:text-5xl text-center leading-relaxed font-light">
            Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.
          </p>
        </div>
        
        <div className="mt-12 text-2xl">
          Step 3 <span className="text-gray-400">/ 8</span>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-3 right-3 flex flex-col space-y-3">
        <button className="bg-blue-500 text-white w-14 h-14 rounded-full text-2xl shadow-lg">
          →
        </button>
        <button className="bg-gray-700 text-white w-14 h-14 rounded-full text-2xl shadow-lg">
          ←
        </button>
      </div>

      {/* Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 flex justify-around">
        <button className="text-lg p-2">Ingredients</button>
        <button className="text-lg p-2 bg-amber-500 px-4 rounded-full">Start Timer</button>
        <button className="text-lg p-2">All Steps</button>
      </div>
    </div>
  );
}