// src/app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question, ticker }), // match expected backend format
      });

      const data = await res.json();
      setResponse(data.answer || "No response received");
    } catch (err) {
      console.error(err);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-tradingDark text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-bloombergGray p-4 border-r border-zinc-700">
        <h2 className="text-xl font-bold mb-6">Stock Insight</h2>
        <nav className="flex flex-col gap-4 text-zinc-300">
          <button className="hover:text-white transition">Dashboard</button>
          <button className="hover:text-white transition">News</button>
          <button className="hover:text-white transition">Sentiment</button>
          <button className="hover:text-white transition">Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">{ticker ? ticker.toUpperCase() : "[Ticker]"} - Stock Insight</h1>
            <p className="text-sm text-zinc-400">NASDAQ: {ticker || "TICKER"}</p>
          </div>
          <div className="text-green-400 font-semibold text-lg">+1.24%</div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-bloombergGray p-4 rounded-lg h-80 flex items-center justify-center text-zinc-400">
          📈 Chart / Sentiment Visualization Placeholder
        </div>

        {/* News Section */}
        <section className="bg-bloombergGray p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Ask a Question</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 rounded-md text-black"
                placeholder="e.g. What news is affecting Apple stock?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Ticker</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full p-2 rounded-md text-black"
                placeholder="e.g. AAPL"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
          {response && (
            <div className="bg-zinc-800 mt-4 p-4 rounded-md border border-zinc-600">
              <h2 className="text-lg font-semibold mb-2">Response</h2>
              <p>{response}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}