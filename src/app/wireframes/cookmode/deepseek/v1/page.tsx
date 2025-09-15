// Version 1: Minimalist Focus Design
export default function CookModeV1() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button className="text-2xl p-2">←</button>
        <h1 className="text-xl font-bold">Classic Carbonara</h1>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">●</span>
          <span>Awake</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl font-medium leading-relaxed">
            Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.
          </p>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between p-6 bg-white border-t">
        <button className="bg-blue-500 text-white text-xl px-8 py-4 rounded-lg">
          Previous
        </button>
        <span className="text-xl flex items-center">Step 3 of 8</span>
        <button className="bg-blue-500 text-white text-xl px-8 py-4 rounded-lg">
          Next
        </button>
      </div>

      {/* Utility Buttons */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-white border-t">
        <button className="bg-gray-200 text-xl p-4 rounded-lg">
          Ingredients
        </button>
        <button className="bg-gray-200 text-xl p-4 rounded-lg">
          All Steps
        </button>
      </div>

      {/* Timer Button */}
      <div className="p-4 bg-white border-t">
        <button className="bg-yellow-400 text-xl w-full p-4 rounded-lg">
          Start 10min Timer
        </button>
      </div>
    </div>
  );
}