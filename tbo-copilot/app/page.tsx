"use client";

import { useState, useEffect } from "react";

/* ---------------- Typing Effect ---------------- */
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <p className="text-gray-400 mt-1">{displayed}</p>;
}

/* ---------------- Main Page ---------------- */
export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [listening, setListening] = useState(false);

  const suggestions = [
    "Luxury hotel in Goa under ₹10,000",
    "Family-friendly hotel near Baga beach",
    "3-star hotel with free cancellation",
    "Best budget hotel in North Goa",
  ];

  /* ---------- Voice ---------- */
  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition works best in Chrome desktop.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  /* ---------- Ask AI ---------- */
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

      {/* Search Section */}
      <div className="w-full max-w-2xl">
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
          {/* Input Row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Try: 3-star hotel in Goa under ₹6000 near beach"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder-gray-400 text-sm"
            />

            {/* Mic */}
            <button
              onClick={startVoiceInput}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🎤
            </button>

            {/* Ask */}
            <button
              onClick={askCopilot}
              className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
            >
              Ask AI
            </button>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((text, i) => (
              <button
                key={i}
                onClick={() => setQuery(text)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-gray-300 transition"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
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
              <h2 className="text-xl font-semibold">
                #{index + 1} {hotel.hotelName}
              </h2>

              <p className="mt-2 text-gray-300">Price: ₹{hotel.price}</p>

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

              <div className="mt-4">
                <p className="font-medium text-white">Why this hotel?</p>
                <TypingText text={hotel.reason} />
              </div>

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
