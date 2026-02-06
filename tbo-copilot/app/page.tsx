"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const askCopilot = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col items-center px-4">
      {/* Header */}
      <div className="w-full max-w-4xl pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🤖 TBO Agent Copilot
        </h1>
        <p className="mt-4 text-gray-400">
          AI-powered decision intelligence for faster, safer hotel bookings
        </p>
      </div>

      {/* Search Box */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl flex gap-2">
        <input
          type="text"
          placeholder="Try: 3-star hotel in Goa under ₹6000 near beach"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none px-3 py-2 text-white placeholder-gray-400"
        />
        <button
          onClick={askCopilot}
          className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          Ask AI
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-6 text-gray-400 animate-pulse">
          Thinking like a senior travel agent…
        </p>
      )}

      {/* Results */}
      {result?.hotels && (
        <div className="mt-10 w-full max-w-3xl space-y-6">
          <p className="text-sm text-gray-400">
            Powered by AI Decision Intelligence
          </p>

          {result.hotels.map((hotel: any, index: number) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              {/* Rank + Name */}
              <h2 className="text-xl font-semibold">
                #{index + 1} {hotel.hotelName}
              </h2>

              {/* Price */}
              <p className="mt-2 text-gray-300">Price: ₹{hotel.price}</p>

              {/* Confidence Bar */}
              <div className="mt-4">
                <p className="text-sm mb-1 text-gray-400">
                  AI Confidence: {hotel.confidence}%
                </p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full transition-all"
                    style={{ width: `${hotel.confidence}%` }}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="mt-4">
                <p className="font-medium text-white">Why this hotel?</p>
                <p className="text-gray-400 mt-1">{hotel.reason}</p>
              </div>

              {/* Alert */}
              {hotel.alert && (
                <p className="mt-4 text-red-400 font-medium">
                  ⚠️ {hotel.alert}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="mt-16 mb-8 text-xs text-gray-500">
        Built for TBO VoyageHack • AI Agent Copilot Prototype
      </p>
    </main>
  );
}
