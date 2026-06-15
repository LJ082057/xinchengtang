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
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-24">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
          <Moon className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">周公解梦</h1>
        <p className="text-base text-paper-dark/85">百梦皆有意 · 古今相参证</p>
      </section>

      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
        <label className="text-sm text-paper-dark/75">请描述您梦中所见</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && interpret()}
            placeholder="例如：梦见蛇、梦见掉牙齿..."
            className="flex-1 h-12 rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
          <button onClick={interpret} disabled={!keyword.trim() || loading}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-vermillion text-white font-body font-medium transition-all duration-fast hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed">
            <Search className="size-4" /> 解梦
          </button>
        </div>
      </div>

      {!result && !loading && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
          <p className="text-sm text-gold">热门梦境</p>
          <div className="flex flex-wrap gap-2">
            {hotDreams.map(d => (
              <button key={d} onClick={() => setKeyword(d)}
                className="rounded-full border border-gold/20 px-3 py-1.5 text-sm text-paper-dark hover:border-gold/40 hover:text-gold transition-all duration-fast">
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm text-center space-y-4">
          <div className="relative mx-auto flex size-20 items-center justify-center">
            <span className="absolute size-full animate-thinking-pulse rounded-full border-2 border-gold/40" />
            <span className="absolute size-full animate-thinking-pulse rounded-full border-2 border-gold/30" style={{animationDelay:'0.7s'}} />
            <Moon className="size-8 text-gold" />
          </div>
          <p className="text-base text-gold">周公正在解梦中…</p>
          <p className="text-sm text-paper-dark/75">梦境千变，细细参详…</p>
        </div>
      )}

      {result && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-4">
          <p className="text-sm text-gold">🌙 周公解梦</p>
          <div className="space-y-4 text-base leading-relaxed text-paper">
            {result.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="indent-8">{p}</p>
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-sm text-gold">
                <span className="flex gap-1">
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-gold" />
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-gold" style={{animationDelay:'0.2s'}} />
                  <span className="size-1.5 animate-thinking-dot rounded-full bg-gold" style={{animationDelay:'0.4s'}} />
                </span>
                <span className="italic">周公正在沉思…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 分享赚福报 */}
      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm text-center space-y-3">
        <p className="text-sm text-gold">🙏 分享给好友 · 赚福报金</p>
        <p className="text-xs text-paper-dark/70">发给朋友解梦，双方各得 1 福报金</p>
        <button className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-all duration-fast">
          📤 分享赚福报
        </button>
      </div>
    </div>
  );
}
