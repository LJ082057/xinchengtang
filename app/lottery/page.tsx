"use client";
import { useState } from "react";

const MASTERS = [
  { id: "huiming", name: "慧明长老", emoji: "🧘", desc: "古寺住持，庄重持重，引经据典", style: "稳重" },
  { id: "mingxin", name: "明心师父", emoji: "🙏", desc: "尼众法师，慈悲温柔，劝人向善", style: "慈悲" },
  { id: "xuanzhen", name: "玄真道长", emoji: "☯️", desc: "山中道人，直爽通透，说大白话", style: "直爽" },
];

export default function LotteryPage() {
  const [master, setMaster] = useState("huiming");
  const [question, setQuestion] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streaming, setStreaming] = useState(false);
  const [interpretation, setInterpretation] = useState("");

  const draw = async () => {
    if (!question.trim()) return;
    setDrawing(true);
    setResult(null);
    setInterpretation("");

    const signNum = Math.floor(Math.random() * 100) + 1;

    const res = await fetch("/api/lottery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signNum, question, master }),
    });

    if (!res.ok) { setDrawing(false); return; }

    const data = await res.json();
    setResult(data);
    setDrawing(false);

    setStreaming(true);
    const streamRes = await fetch("/api/lottery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signNum, question, master, interpret: true }),
    });

    if (streamRes.body) {
      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setInterpretation(prev => prev + decoder.decode(value, { stream: true }));
      }
    }
    setStreaming(false);
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
        <section className="text-center space-y-3">
          <h1 className="text-4xl text-gold">第 {result.number} 签</h1>
          <p className="text-xl text-paper-dark">{result.title}</p>
        </section>

        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-paper-dark/60">签诗</p>
            {result.poem.split("\n").map((line: string, i: number) => (
              <p key={i} className="text-lg text-gold gold-glow">{line}</p>
            ))}
          </div>
          <div className="gold-divider" />
          <div className="text-center space-y-2">
            <p className="text-sm text-paper-dark/60">签意</p>
            <p className="text-base text-paper-dark/85">{result.meaning}</p>
          </div>
        </div>

        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">
            {MASTERS.find(m => m.id === master)?.emoji} {MASTERS.find(m => m.id === master)?.name} 开示
          </p>
          {streaming && !interpretation && (
            <div className="flex items-center gap-2 text-sm text-paper-dark/60">
              <span className="animate-pulse">师父正在沉思请示中…</span>
            </div>
          )}
          <div className="space-y-4 font-body text-base leading-relaxed text-paper">
            {interpretation.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="indent-8">{p}</p>
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-sm text-purple-light">
                <span className="flex gap-1">
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-purple" />
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-purple" style={{animationDelay:'0.2s'}} />
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-purple" style={{animationDelay:'0.4s'}} />
                </span>
                <span className="italic">师父正在沉思…</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => { setResult(null); setInterpretation(""); setQuestion(""); }}
          className="w-full h-12 rounded-lg border border-purple/40 text-purple-light hover:bg-purple/10">
          再求一签
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-purple/20 bg-purple/5">
          <span className="text-3xl">📜</span>
        </div>
        <h1 className="text-4xl text-gold">关帝灵签</h1>
        <p className="text-base text-paper-dark/85">心诚则灵，一签一事。</p>
      </section>

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
        <p className="text-sm text-paper-dark/75">请选一位师父为您解签</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MASTERS.map(m => (
            <button key={m.id} onClick={() => setMaster(m.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                master === m.id
                  ? "border-purple/60 bg-purple/10 shadow-purple"
                  : "border-purple/20 bg-xuan-surface/40 hover:border-purple/40"
              }`}>
              <span className="text-3xl">{m.emoji}</span>
              <p className="mt-2 text-lg text-gold">{m.name}</p>
              <p className="text-xs text-paper-dark/65">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-paper-dark/75">您想问什么事？</label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="例如：今年事业能否有所突破？"
            rows={3}
            className="w-full rounded-xl border border-purple/30 bg-xuan-surface px-4 py-3 text-paper-dark placeholder:text-paper-dark/30 focus:border-purple focus:outline-none resize-none" />
        </div>
      </div>

      <button onClick={draw} disabled={!question.trim() || drawing}
        className="w-full h-14 rounded-lg bg-purple text-white text-xl tracking-wider shadow-lg shadow-purple/30 hover:bg-purple-light disabled:opacity-30 disabled:cursor-not-allowed">
        {drawing ? "求签中..." : "📜 诚心求签"}
      </button>
    </div>
  );
}
