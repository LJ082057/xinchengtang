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

  const dreamCategories = [
    { name: "动物", items: ["蛇","狗","猫","龙","鱼","鸟","老鼠","猪","牛","马"] },
    { name: "身体", items: ["牙齿","血","头发","眼睛","手","脚","肚子"] },
    { name: "自然", items: ["水","火","雨","雪","山","河","太阳","月亮"] },
    { name: "人物", items: ["死人","小孩","结婚","老人","陌生人","亲人"] },
    { name: "物品", items: ["钱","棺材","车","房子","手机","刀"] },
    { name: "动作", items: ["飞","考试","吃饭","洗澡","迷路","打架","哭"] },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-24">
      <section className="space-y-3 pt-6 text-center">
        <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
          <Moon className="size-8 text-gold" />
        </div>
        <h1 className="font-display text-4xl tracking-widest text-gold">周公解梦</h1>
        <p className="text-base text-paper-dark/85">百梦皆有意 · 古今相参证</p>
      </section>

      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
        <p className="text-base text-paper-dark/85">请描述您梦中所见</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && interpret()}
            placeholder="如:梦见龙、梦见牙齿掉了"
            maxLength={100}
            className="rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 h-12 w-full text-base sm:flex-1" />
          <button onClick={interpret} disabled={!keyword.trim() || loading}
            className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark px-5 text-base h-12 w-full whitespace-nowrap sm:w-auto">
            <Search className="size-4" />解梦
          </button>
        </div>
      </div>

      {!result && !loading && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
          <h2 className="font-display text-xl text-gold">按类查梦</h2>
          {dreamCategories.map(cat => (
            <div key={cat.name} className="space-y-2">
              <p className="text-sm text-paper-dark/70">{cat.name}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(d => (
                  <button key={d} onClick={() => setKeyword(`梦见${d}`)}
                    className="rounded-full border border-gold/20 px-3 py-1.5 text-sm text-paper-dark hover:border-gold/40 hover:text-gold transition-all duration-fast">
                    梦见{d}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
          <p className="text-sm text-gold">🌙 周公解梦 · 梦见{keyword.replace("梦见","")}</p>
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
          <button onClick={() => { setResult(""); setKeyword(""); }}
            className="w-full h-12 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-all duration-fast">
            再解一梦
          </button>
        </div>
      )}

      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm text-center space-y-3">
        <p className="text-sm text-gold">🙏 分享给好友 · 赚福报金</p>
        <p className="text-xs text-paper-dark/70">发给朋友解梦，双方各得 1 福报金</p>
        <button onClick={() => {
          if (navigator.share) {
            navigator.share({ title: "心诚堂 · 周公解梦", text: "我刚在心诚堂解了个梦，你也来试试吧！", url: window.location.origin + "/dream/" }).catch(() => {});
          } else {
            navigator.clipboard.writeText(window.location.origin + "/dream/").then(() => alert("链接已复制！"));
          }
        }} className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-all duration-fast active:scale-95">
          📤 分享赚福报
        </button>
      </div>
    </div>
  );
}
