"use client";
import { useState, useEffect, useRef } from "react";
import { Flame, Play, Pause, RotateCcw } from "lucide-react";

const DURATIONS = [
  { min: 5, label: "5分钟" },
  { min: 10, label: "10分钟" },
  { min: 20, label: "20分钟" },
  { min: 30, label: "30分钟" },
];

export default function MeditationPage() {
  const [duration, setDuration] = useState(10);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) { setRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const start = () => { setRemaining(duration * 60); setRunning(true); setStarted(true); };
  const toggle = () => setRunning(!running);
  const reset = () => { setRunning(false); setStarted(false); setRemaining(0); };

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const progress = started ? 1 - remaining / (duration * 60) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">
      <section className="text-center space-y-3">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Flame className="size-8 text-gold" />
        </div>
        <h1 className="text-4xl text-gold">静心禅坐</h1>
        <p className="text-base text-paper-dark/85">放下执念，静心观呼吸。日日一坐，福报自来。</p>
      </section>

      {!started ? (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-6">
          <p className="text-sm text-gold text-center">选择禅坐时长</p>
          <div className="grid grid-cols-2 gap-3">
            {DURATIONS.map(d => (
              <button key={d.min} onClick={() => setDuration(d.min)}
                className={`rounded-xl border p-4 text-center transition-all ${
                  duration === d.min ? "border-gold/60 bg-gold/10" : "border-gold/20 bg-xuan-surface/40 hover:border-gold/40"
                }`}>
                <p className="text-2xl text-gold">{d.min}</p>
                <p className="text-sm text-paper-dark/60">{d.label}</p>
              </button>
            ))}
          </div>
          <button onClick={start} className="w-full h-14 rounded-lg bg-vermillion text-white text-xl tracking-wider hover:bg-vermillion-light flex items-center justify-center gap-2">
            <Play className="size-5" /> 开始禅坐
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center space-y-8">
          <div className="relative mx-auto size-48">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(212,168,67,0.15)" strokeWidth="4" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#d4a843" strokeWidth="4"
                strokeDasharray={`${progress * 283} 283`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl text-gold font-mono">{formatTime(remaining)}</p>
              <p className="text-sm text-paper-dark/60 mt-1">{running ? "禅坐中..." : "已暂停"}</p>
            </div>
          </div>
          
          <p className="text-paper-dark/70 text-sm">
            {running ? "端身正坐，观照呼吸。不随念转，不随境迁。" : "暂停休息，随时可继续。"}
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={toggle} className="h-12 px-8 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 flex items-center gap-2">
              {running ? <><Pause className="size-4" /> 暂停</> : <><Play className="size-4" /> 继续</>}
            </button>
            <button onClick={reset} className="h-12 px-8 rounded-lg border border-gold/30 text-paper-dark hover:bg-gold/10 flex items-center gap-2">
              <RotateCcw className="size-4" /> 重来
            </button>
          </div>

          {remaining === 0 && started && (
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-6 space-y-2">
              <p className="text-xl text-gold">🙏 禅坐圆满</p>
              <p className="text-paper-dark/80">功德无量，随喜赞叹。愿以此功德，回向一切众生。</p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-6 space-y-4">
        <p className="text-sm text-gold">禅修指引</p>
        <div className="space-y-3 text-sm text-paper-dark/80">
          <p>1. 找一个安静的地方，端身正坐</p>
          <p>2. 轻轻闭上双眼，放松全身</p>
          <p>3. 将注意力放在呼吸上，感受气息进出</p>
          <p>4. 念头来了不要跟随，轻轻拉回呼吸</p>
          <p>5. 保持觉知，安住当下</p>
        </div>
      </div>
    </div>
  );
}