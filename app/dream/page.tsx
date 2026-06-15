"use client";
import { useState } from "react";
import { Moon, Search } from "lucide-react";

export default function DreamPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);

  const interpret = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setResult("");
    setStreaming(true);

    const res = await fetch("/api/dream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
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

  const hotDreams = ["蛇","水","牙齿","死人","考试","飞","结婚","小孩","火","鱼","血","棺材","钱","雨","狗","猫","龙","鬼","山","月亮","太阳","树","花","车祸","怀孕","吃饭","洗澡","坐飞机","迷路"];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Moon className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">周公解梦</h1>
        <p className="text-base text-paper-dark/85">百梦皆有意，古今相参证</p>
      </section>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <label className="text-sm text-paper-dark/75">描述你的梦境</label>
        <div className="flex gap-2">
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && interpret()}
            placeholder="例如：梦见蛇、梦见掉牙齿..."
            className="flex-1 h-12 rounded-xl border border-gold/30 bg-xuan-surface px-4 text-paper-dark placeholder:text-paper-dark/30 focus:border-gold focus:outline-none" />
          <button onClick={interpret} disabled={!keyword.trim() || loading}
            className="h-12 px-6 rounded-xl bg-vermillion text-white hover:bg-vermillion-light disabled:opacity-30 flex items-center gap-2">
            <Search className="size-4" /> 解梦
          </button>
        </div>
      </div>

      {!result && !loading && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">热门梦境</p>
          <div className="flex flex-wrap gap-2">
            {hotDreams.map(d => (
              <button key={d} onClick={() => { setKeyword(d); }}
                className="rounded-full border border-gold/20 px-3 py-1.5 text-sm text-paper-dark hover:border-gold/40 hover:text-gold transition-colors">
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center space-y-4">
          <p className="text-gold animate-pulse">周公正在解梦中...</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">🌙 周公解梦</p>
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