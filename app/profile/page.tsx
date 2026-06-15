"use client";
import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function ProfilePage() {
  const [phone, setPhone] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const search = () => {
    setSearched(true);
    // Mock - in production this would query a database
    const stored = typeof window !== "undefined" ? localStorage.getItem("xinchengtang_records") : null;
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <KeyRound className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">找回记录</h1>
        <p className="text-base text-paper-dark/85">输入手机号，找回您的祈福、求签记录</p>
      </section>

      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper space-y-4">
        <label className="text-sm text-paper-dark/75">手机号</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={phone} onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="请输入手机号"
            className="flex-1 h-12 rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
          <button onClick={search}
            className="h-12 px-6 rounded-md bg-vermillion text-white font-body font-medium transition-all duration-fast hover:bg-vermillion-light">
            查找
          </button>
        </div>
      </div>

      {searched && records.length === 0 && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper text-center space-y-3">
          <p className="text-paper-dark/70">暂无记录</p>
          <p className="text-xs text-paper-dark/50">您还没有在心诚堂的祈福、求签记录</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper space-y-3">
          <p className="text-sm text-gold">您的记录</p>
          {records.map((r, i) => (
            <div key={i} className="rounded border border-gold/15 bg-xuan-surface/40 p-3">
              <p className="text-paper-dark">{r.type}: {r.content}</p>
              <p className="text-xs text-paper-dark/50">{r.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
