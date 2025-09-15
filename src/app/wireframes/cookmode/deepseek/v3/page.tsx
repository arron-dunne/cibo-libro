// Version 3: Dark Theme Design
export default function CookModeV3() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button className="text-2xl p-3">←</button>
        <div className="text-center">
          <h1 className="text-xl font-bold">CLASSIC CARBONARA</h1>
          <div className="flex items-center justify-center">
            <span className="text-green-400 mr-2">●</span>
            <span className="text-sm">Screen awake</span>
          </div>
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Step Indicator */}
      <div className="px-4 pb-2">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-blue-500 h-3 rounded-full" style={{width: '37%'}}></div>
        </div>
        <div className="text-right text-sm mt-1">Step 3 of 8</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-4xl text-center leading-relaxed">
          Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.
        </p>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <button className="bg-gray-800 text-xl p-4 rounded-lg border border-gray-700">
          Previous Step
        </button>
        <button className="bg-blue-600 text-xl p-4 rounded-lg">
          Next Step
        </button>
      </div>

      {/* Utilities */}
      <div className="grid grid-cols-2 gap-4 p-4 border-t border-gray-800">
        <button className="bg-gray-800 text-lg p-4 rounded-lg">
          Show Ingredients
        </button>
        <button className="bg-gray-800 text-lg p-4 rounded-lg">
          View All Steps
        </button>
      </div>

      {/* Timer */}
      <div className="p-4">
        <button className="bg-amber-500 text-gray-900 text-xl w-full p-4 rounded-lg font-bold">
          ⏱️ Start 10-Minute Timer
        </button>
      </div>
    </div>
  );
}