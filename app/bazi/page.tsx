"use client";
import { useState } from "react";

const MASTERS = [
  { id: "huiming", name: "慧明长老", emoji: "🧘", desc: "古寺住持，庄重持重，引经据典" },
  { id: "mingxin", name: "明心师父", emoji: "🙏", desc: "尼众法师，慈悲温柔，劝人向善" },
  { id: "xuanzhen", name: "玄真道长", emoji: "☯️", desc: "山中道人，直爽通透，说大白话" },
];

const HOURS = [
  {v:"zi",l:"子时 (23:00-01:00)"},{v:"chou",l:"丑时 (01:00-03:00)"},
  {v:"yin",l:"寅时 (03:00-05:00)"},{v:"mao",l:"卯时 (05:00-07:00)"},
  {v:"chen",l:"辰时 (07:00-09:00)"},{v:"si",l:"巳时 (09:00-11:00)"},
  {v:"wu",l:"午时 (11:00-13:00)"},{v:"wei",l:"未时 (13:00-15:00)"},
  {v:"shen",l:"申时 (15:00-17:00)"},{v:"you",l:"酉时 (17:00-19:00)"},
  {v:"xu",l:"戌时 (19:00-21:00)"},{v:"hai",l:"亥时 (21:00-23:00)"},
];

export default function BaziPage() {
  const [master, setMaster] = useState("huiming");
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState("wei");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [reasoning, setReasoning] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    setReasoning("");
    setStreaming(true);

    const res = await fetch("/api/bazi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, month, day, hour, gender, master }),
    });

    if (!res.ok || !res.body) {
      setLoading(false);
      setStreaming(false);
      return;
    }

    setLoading(false);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      for (const line of lines) {
        if (line.startsWith("REASONING:")) {
          setReasoning(prev => prev + line.slice(10));
        } else if (line.startsWith("CONTENT:")) {
          setResult(prev => prev + line.slice(8));
        }
      }
    }
    setStreaming(false);
  };

  const masterInfo = MASTERS.find(m => m.id === master);

  if (result || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
        <section className="text-center space-y-3">
          <h1 className="text-4xl text-gold">八字精批</h1>
          <p className="text-sm text-paper-dark/60">{year}年{month}月{day}日 · {HOURS.find(h=>h.v===hour)?.l} · {gender==="male"?"男":"女"}</p>
        </section>

        {loading && (
          <div className="rounded-lg border border-purple/20 bg-xuan-surface/40 px-6 py-10 text-center space-y-4">
            <div className="relative mx-auto flex size-20 items-center justify-center">
              <span className="absolute size-full animate-thinking-pulse rounded-full border-2 border-purple/40" />
              <span className="absolute size-full animate-thinking-pulse rounded-full border-2 border-purple/30" style={{animationDelay:'0.7s'}} />
              <span className="text-3xl">{masterInfo?.emoji}</span>
            </div>
            <p className="text-base text-purple-light">{masterInfo?.name} 正在沉思请示中…</p>
            <p className="text-sm text-paper-dark/75">推演气数，凝神开示…</p>
          </div>
        )}

        {reasoning && (
          <div className="rounded-lg border border-purple/10 bg-xuan-surface/30 p-4 space-y-2">
            <p className="text-xs text-purple-light/60">💭 师父推理过程</p>
            <p className="text-sm text-paper-dark/60 leading-relaxed">{reasoning}</p>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
            <p className="text-sm text-gold">{masterInfo?.emoji} {masterInfo?.name} 开示</p>
            <div className="space-y-4 text-base leading-relaxed text-paper md:text-lg md:leading-loose">
              {result.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="indent-8">{p}</p>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => { setResult(""); setReasoning(""); }}
          className="w-full h-12 rounded-lg border border-purple/40 text-purple-light hover:bg-purple/10">
          重新排盘
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-purple/20 bg-purple/5">
          <span className="text-3xl">🔮</span>
        </div>
        <h1 className="text-4xl text-gold">八字精批</h1>
        <p className="text-base text-paper-dark/85">输入生辰，洞悉天命，先看命盘，再看流年。</p>
      </section>

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
        <p className="text-sm text-paper-dark/75">请选一位师父为您开示</p>
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

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {label:"出生年",value:year,set:setYear,min:1940,max:2026},
            {label:"出生月",value:month,set:setMonth,min:1,max:12},
            {label:"出生日",value:day,set:setDay,min:1,max:31},
          ].map(f => (
            <div key={f.label} className="space-y-2">
              <p className="text-sm text-paper-dark/75">{f.label}</p>
              <div className="flex h-16 items-stretch rounded-xl border border-purple/30 bg-xuan-surface">
                <button onClick={() => f.set(Math.max(f.min, f.value-1))}
                  className="flex w-12 items-center justify-center text-paper-dark hover:bg-purple/10">▼</button>
                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="font-number text-2xl text-gold">{f.value}{f.label==="出生年"?"年":f.label==="出生月"?"月":"日"}</span>
                </div>
                <button onClick={() => f.set(Math.min(f.max, f.value+1))}
                  className="flex w-12 items-center justify-center text-paper-dark hover:bg-purple/10">▲</button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-paper-dark/75">出生时辰</label>
            <select value={hour} onChange={e => setHour(e.target.value)}
              className="h-16 w-full rounded-xl border border-purple/30 bg-xuan-surface px-4 text-lg text-paper-dark focus:border-purple focus:outline-none">
              {HOURS.map(h => <option key={h.v} value={h.v}>{h.l}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-paper-dark/75">性别</p>
            <div className="flex h-16 items-stretch rounded-xl border border-purple/30 bg-xuan-surface overflow-hidden">
              <button onClick={() => setGender("male")}
                className={`flex-1 text-lg transition-colors ${gender==="male"?"bg-purple/15 text-purple-light":"text-paper-dark hover:bg-purple/5"}`}>男</button>
              <button onClick={() => setGender("female")}
                className={`flex-1 text-lg transition-colors ${gender==="female"?"bg-purple/15 text-purple-light":"text-paper-dark hover:bg-purple/5"}`}>女</button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit}
        className="w-full h-14 rounded-lg bg-purple text-white text-xl tracking-wider shadow-lg shadow-purple/30 hover:bg-purple-light">
        🔮 请师父排盘
      </button>
    </div>
  );
}
