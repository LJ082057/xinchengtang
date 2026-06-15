"use client";
import { useState } from "react";
import { ScrollText } from "lucide-react";

export default function DivinationPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [coins, setCoins] = useState<number[]>([]);
  const [throwing, setThrowing] = useState(false);

  const throwCoins = () => {
    if (!question.trim()) return;
    setThrowing(true);
    setCoins([]);
    
    // Animate coin throws
    const results: number[] = [];
    let count = 0;
    const interval = setInterval(() => {
      const c = Array.from({length: 3}, () => Math.random() > 0.5 ? 3 : 2);
      results.push(c.reduce((a,b) => a+b, 0));
      setCoins([...results]);
      count++;
      if (count >= 6) {
        clearInterval(interval);
        setThrowing(false);
        startReading();
      }
    }, 500);
  };

  const startReading = async () => {
    setLoading(true);
    setResult("");
    setStreaming(true);

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok || !res.body) { setLoading(false); setStreaming(false); return; }
    setLoading(false);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setResult(prev => prev + decoder.decode(value, { stream: true }));
    }
    setStreaming(false);
  };

  const coinLabel = (v: number) => {
    if (v === 6) return "老阴 ⚋";
    if (v === 7) return "少阳 ⚊";
    if (v === 8) return "少阴 ⚋";
    return "老阳 ⚊";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <ScrollText className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">六爻占卜</h1>
        <p className="text-base text-paper-dark/85">心起一念，三铜起卦，再观爻象之变，定一时之趋避</p>
      </section>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <label className="text-sm text-paper-dark/75">您想问什么事？</label>
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="例如：今年事业能否有所突破？"
          rows={3} className="w-full rounded-xl border border-gold/30 bg-xuan-surface px-4 py-3 text-paper-dark placeholder:text-paper-dark/30 focus:border-gold focus:outline-none resize-none" />
      </div>

      {coins.length > 0 && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold text-center">六爻卦象</p>
          <div className="space-y-2">
            {coins.slice().reverse().map((c, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 rounded border border-gold/15 bg-xuan-surface/40">
                <span className="text-paper-dark">第{6-i}爻</span>
                <span className="text-gold">{coinLabel(c)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={throwCoins} disabled={!question.trim() || throwing || loading}
        className="w-full h-14 rounded-lg bg-vermillion text-white text-xl tracking-wider shadow-lg shadow-vermillion/30 hover:bg-vermillion-light disabled:opacity-30">
        {throwing ? "摇卦中..." : loading ? "解卦中..." : "🎲 诚心摇卦"}
      </button>

      {loading && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center">
          <p className="text-gold animate-pulse">大师正在解读卦象...</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">📜 卦象解读</p>
          <div className="space-y-4 text-base leading-relaxed text-paper">
            {result.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="indent-8">{p}</p>
            ))}
            {streaming && <span className="inline-block w-2 h-4 bg-gold animate-pulse ml-1" />}
          </div>
        </div>
      )}
    </div>
  );
}