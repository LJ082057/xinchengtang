"use client";
import { useState } from "react";
import { BookOpen } from "lucide-react";

export default function NamingPage() {
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("male");
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState("wu");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);

  const HOURS = [
    {v:"zi",l:"子时 (23-01)"},{v:"chou",l:"丑时 (01-03)"},{v:"yin",l:"寅时 (03-05)"},
    {v:"mao",l:"卯时 (05-07)"},{v:"chen",l:"辰时 (07-09)"},{v:"si",l:"巳时 (09-11)"},
    {v:"wu",l:"午时 (11-13)"},{v:"wei",l:"未时 (13-15)"},{v:"shen",l:"申时 (15-17)"},
    {v:"you",l:"酉时 (17-19)"},{v:"xu",l:"戌时 (19-21)"},{v:"hai",l:"亥时 (21-23)"}
  ];

  const handleSubmit = async () => {
    if (!surname.trim()) return;
    setLoading(true);
    setResult("");
    setStreaming(true);

    const res = await fetch("/api/naming", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surname, gender, year, month, day, hour }),
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

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <BookOpen className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">宝宝起名</h1>
        <p className="text-base text-paper-dark/85">结合八字喜忌、音韵笔画、典故诗词，给孩子一个耐看的名字</p>
      </section>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-paper-dark/75">姓氏</label>
          <input value={surname} onChange={e => setSurname(e.target.value)}
            placeholder="请输入姓氏" className="w-full h-12 rounded-xl border border-gold/30 bg-xuan-surface px-4 text-paper-dark placeholder:text-paper-dark/30 focus:border-gold focus:outline-none" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-paper-dark/75">性别</p>
          <div className="flex h-12 rounded-xl border border-gold/30 bg-xuan-surface overflow-hidden">
            <button onClick={() => setGender("male")} className={`flex-1 text-lg ${gender==="male" ? "bg-gold/15 text-gold" : "text-paper-dark"}`}>男</button>
            <button onClick={() => setGender("female")} className={`flex-1 text-lg ${gender==="female" ? "bg-gold/15 text-gold" : "text-paper-dark"}`}>女</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{l:"出生年",v:year,s:setYear,min:2020,max:2026},{l:"出生月",v:month,s:setMonth,min:1,max:12},{l:"出生日",v:day,s:setDay,min:1,max:31}].map(f => (
            <div key={f.l} className="space-y-2">
              <p className="text-sm text-paper-dark/75">{f.l}</p>
              <div className="flex h-14 items-stretch rounded-xl border border-gold/30 bg-xuan-surface">
                <button onClick={() => f.s(Math.max(f.min, f.value-1))} className="flex w-10 items-center justify-center text-paper-dark hover:bg-gold/10">▼</button>
                <div className="flex flex-1 items-center justify-center"><span className="text-xl text-gold">{f.v}</span></div>
                <button onClick={() => f.s(Math.min(f.max, f.value+1))} className="flex w-10 items-center justify-center text-paper-dark hover:bg-gold/10">▲</button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-paper-dark/75">出生时辰</label>
          <select value={hour} onChange={e => setHour(e.target.value)} className="h-12 w-full rounded-xl border border-gold/30 bg-xuan-surface px-4 text-paper-dark focus:border-gold focus:outline-none">
            {HOURS.map(h => <option key={h.v} value={h.v}>{h.l}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!surname.trim() || loading}
        className="w-full h-14 rounded-lg bg-vermillion text-white text-xl tracking-wider shadow-lg shadow-vermillion/30 hover:bg-vermillion-light disabled:opacity-30">
        {loading ? "起名中..." : "📖 请大师起名"}
      </button>

      {loading && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center">
          <p className="text-gold animate-pulse">大师正在推演五行...</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">📖 大师起名</p>
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