// Version 2: Card-Based Design
export default function CookModeV2() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button className="text-3xl p-3 rounded-full bg-white shadow">←</button>
        <div>
          <h1 className="text-xl font-bold text-center">Cook Mode</h1>
          <h2 className="text-lg text-center">Classic Carbonara</h2>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-500">●</span>
          <span className="text-sm">Awake</span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-3xl text-center leading-relaxed">
              Whisk together eggs, egg yolks, and grated Pecorino Romano in a bowl until creamy.
            </p>
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button className="text-2xl bg-gray-100 p-4 rounded-xl">←</button>
            <span className="text-xl">Step 3/8</span>
            <button className="text-2xl bg-gray-100 p-4 rounded-xl">→</button>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <button className="bg-white p-4 rounded-xl shadow text-lg">
          Ingredients
        </button>
        <button className="bg-yellow-400 p-4 rounded-xl shadow text-lg">
          Start Timer
        </button>
        <button className="bg-white p-4 rounded-xl shadow text-lg">
          All Steps
        </button>
      </div>
    </div>
  );
}