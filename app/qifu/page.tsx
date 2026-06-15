"use client";
import { useState } from "react";

const LAMPS = [
  { id: "month", label: "一月灯", price: "9.9", desc: "挂灯一月，日日受光" },
  { id: "hundred", label: "百日灯", price: "29.9", desc: "百日长明，福泽绵延" },
  { id: "year", label: "一年灯", price: "69.9", desc: "一年常照，阖家平安" },
  { id: "forever", label: "永久长明", price: "199", desc: "永久供灯，福报永续" },
];

export default function QifuPage() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [selected, setSelected] = useState("month");
  const [lit, setLit] = useState(false);

  const handleLit = () => {
    if (!name.trim()) return;
    setLit(true);
  };

  if (lit) {
    const lamp = LAMPS.find(l => l.id === selected);
    return (
      <div className="mx-auto max-w-lg px-4 pt-8 text-center space-y-6">
        <div className="text-6xl animate-float-up">🕯️</div>
        <h2 className="text-3xl text-gold gold-glow">灯已点亮</h2>
        <p className="text-lg text-paper-dark/85">
          {name} 的祈福灯已点亮<br/>
          愿望：{wish || "阖家平安"}
        </p>
        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-3">
          <p className="text-gold">{lamp?.label} · ¥{lamp?.price}</p>
          <p className="text-sm text-paper-dark/70">长按识别赞赏码完成供灯</p>
          <div className="mx-auto w-48 h-48 rounded-lg border border-purple/30 bg-xuan-surface flex items-center justify-center overflow-hidden">
            <img src="/tip-qr.jpg" alt="赞赏码" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-paper-dark/50">付款后灯即刻生效，福报自来</p>
        </div>
        <button onClick={() => setLit(false)} className="text-sm text-gold/60 hover:text-gold">
          再点一盏灯
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-purple/30 bg-purple/10">
          <span className="text-3xl">🕯️</span>
        </div>
        <h1 className="text-4xl text-gold">为家人祈福</h1>
        <p className="text-base text-paper-dark/85">点一盏灯，挂家人姓名。心诚则灵，福报自来。</p>
      </section>

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-paper-dark/75">祈福人姓名</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="请输入姓名"
            className="w-full h-12 rounded-xl border border-purple/30 bg-xuan-surface px-4 text-paper-dark placeholder:text-paper-dark/30 focus:border-purple focus:outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-paper-dark/75">祈福愿望（可选）</label>
          <input value={wish} onChange={e => setWish(e.target.value)}
            placeholder="阖家平安、事业顺利..."
            className="w-full h-12 rounded-xl border border-purple/30 bg-xuan-surface px-4 text-paper-dark placeholder:text-paper-dark/30 focus:border-purple focus:outline-none" />
        </div>
      </div>

      <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 space-y-4">
        <p className="text-sm text-paper-dark/75">选择灯型</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LAMPS.map(lamp => (
            <button key={lamp.id} onClick={() => setSelected(lamp.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selected === lamp.id
                  ? "border-purple/60 bg-purple/10 shadow-purple"
                  : "border-purple/20 bg-xuan-surface/40 hover:border-purple/40"
              }`}>
              <p className="text-lg text-gold">{lamp.label}</p>
              <p className="text-xs text-paper-dark/65">{lamp.desc}</p>
              <p className="mt-2 text-2xl text-purple-light font-number">¥{lamp.price}</p>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleLit} disabled={!name.trim()}
        className="w-full h-14 rounded-lg bg-purple text-white text-xl tracking-wider shadow-lg shadow-purple/30 hover:bg-purple-light disabled:opacity-30 disabled:cursor-not-allowed">
        🕯️ 为 {name || "家人"} 点灯
      </button>
    </div>
  );
}
