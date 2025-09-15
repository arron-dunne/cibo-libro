// Version 4: Kitchen Tablet Design
export default function CookModeV4() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Status Bar */}
      <div className="bg-black text-white p-2 flex justify-between text-sm">
        <span>Cook Mode Active</span>
        <span className="text-green-400">● Screen Awake</span>
      </div>

      {/* Header */}
      <div className="p-4 bg-white flex items-center">
        <button className="text-3xl p-2 mr-4">←</button>
        <h1 className="text-2xl font-bold">Classic Carbonara</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="bg-white rounded-xl shadow-inner p-8 flex-1 flex items-center justify-center">
          <p className="text-4xl text-center leading-relaxed">
            Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 text-center text-xl">
          Step <span className="font-bold">3</span> of <span className="font-bold">8</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-t p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <button className="bg-blue-100 p-3 rounded-lg text-lg">← Prev</button>
          <button className="bg-blue-500 text-white p-3 rounded-lg text-lg col-span-2">
            Timer: 10:00
          </button>
          <button className="bg-blue-100 p-3 rounded-lg text-lg">Next →</button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-200 p-3 rounded-lg text-lg">
            Ingredients
          </button>
          <button className="bg-gray-200 p-3 rounded-lg text-lg">
            All Steps
          </button>
        </div>
      </div>
    </div>
  );
}