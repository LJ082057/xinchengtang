"use client";
import { useState } from "react";
import { Hand, Upload } from "lucide-react";

export default function PalmistryPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    setResult("");
    
    // Simulate palm reading with AI
    const res = await fetch("/api/bazi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: 1990, month: 1, day: 1, hour: "zi", gender: "male", master: "xuanzhen" }),
    });

    if (!res.ok || !res.body) { setLoading(false); return; }
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
        if (line.startsWith("CONTENT:")) {
          setResult(prev => prev + line.slice(8));
        }
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Hand className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">手相图解</h1>
        <p className="text-base text-paper-dark/85">传一张清晰的掌心照，依传统手相学逐线开示</p>
      </section>

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "生命线", desc: "从食指下方出发，弧形包绕拇指球。主健康、寿命、生命力。" },
            { name: "智慧线", desc: "从食指下方横贯掌心。主智慧、思维、判断力。" },
            { name: "感情线", desc: "从小指下方延伸至食指。主感情、婚姻、人际关系。" },
          ].map((line, i) => (
            <div key={i} className="rounded-lg border border-gold/15 bg-xuan-surface/40 p-4 text-center">
              <p className="text-lg text-gold font-display">{line.name}</p>
              <p className="mt-2 text-sm text-paper-dark/80">{line.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-gold/30 bg-xuan-card/50 p-8 text-center space-y-4">
        <Upload className="mx-auto size-12 text-gold/50" />
        <p className="text-paper-dark/70">上传掌心照片，AI 为您解读手相</p>
        <button onClick={handleUpload} className="h-12 px-8 rounded-lg bg-vermillion text-white text-lg hover:bg-vermillion-light">
          选择照片
        </button>
        <p className="text-xs text-paper-dark/50">请上传清晰的掌心照片，光线充足，纹路可见</p>
      </div>

      {loading && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center">
          <p className="text-gold animate-pulse">正在分析掌纹...</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
          <p className="text-sm text-gold">🖐️ 手相解读</p>
          <div className="space-y-4 text-base leading-relaxed text-paper">
            {result.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="indent-8">{p}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}