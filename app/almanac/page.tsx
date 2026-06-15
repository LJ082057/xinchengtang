"use client";
import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";

export default function AlmanacPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/almanac").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="mx-auto max-w-2xl px-4 pt-8 text-center">
      <p className="text-purple-light animate-pulse">正在查询黄历...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <CalendarDays className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">今日黄历</h1>
        <p className="text-base text-paper-dark/85">{data?.date} · {data?.ganzhi?.year} {data?.ganzhi?.month} {data?.ganzhi?.day} · {data?.ganzhi?.shengxiao}年</p>
      </section>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <h2 className="text-xl text-gold text-center">宜</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {data?.yi?.map((item: string, i: number) => (
            <span key={i} className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-400">{item}</span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <h2 className="text-xl text-vermillion text-center">忌</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {data?.ji?.map((item: string, i: number) => (
            <span key={i} className="rounded-full border border-vermillion/30 bg-vermillion/10 px-3 py-1 text-sm text-vermillion">{item}</span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <h2 className="text-xl text-gold text-center">时辰吉凶</h2>
        <div className="grid grid-cols-3 gap-3">
          {data?.hours?.map((h: any, i: number) => (
            <div key={i} className={`rounded-lg border p-3 text-center ${
              h.吉凶 === "吉" ? "border-green-500/30 bg-green-500/5" : "border-vermillion/30 bg-vermillion/5"
            }`}>
              <p className="text-lg text-paper-dark">{h.名}</p>
              <p className="text-xs text-paper-dark/60">{h.时间}</p>
              <p className={`text-sm font-bold ${h.吉凶 === "吉" ? "text-green-400" : "text-vermillion"}`}>{h.吉凶}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}