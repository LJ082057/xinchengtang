"use client";
import { Heart, CalendarDays, Moon, Sparkles, Compass, ScrollText, Hand, BookOpen, Flame } from "lucide-react";

const cards = [
  { href: "/qifu/", icon: Heart, tag: "镇宅祈福", title: "祈福", desc: "点一盏灯，挂家人姓名。心诚则灵，福报自来。" },
  { href: "/almanac/", icon: CalendarDays, tag: "每日宜忌", title: "今日黄历", desc: "查今日宜忌、吉时吉方，择日择吉，趋吉避凶。" },
  { href: "/dream/", icon: Moon, tag: "解梦大全", title: "周公解梦", desc: "梦境寓意全解，梦到蛇、水、牙齿等常见梦解析。" },
  { href: "/lottery/", icon: Sparkles, tag: "传统签谱", title: "关帝灵签", desc: "心诚则灵，一签一事。100支签文出自传统签谱。" },
  { href: "/bazi/", icon: Compass, tag: "传家技艺", title: "八字精批", desc: "立春节气真排盘，看命格根骨与一生气运起伏。" },
  { href: "/divination/", icon: ScrollText, tag: "周易占卜", title: "六爻占卜", desc: "铜钱摇卦，六爻断事。一事一占，精准详析。" },
  { href: "/palmistry/", icon: Hand, tag: "手相命理", title: "手相图解", desc: "掌纹看命，事业线、生命线、感情线全解析。" },
  { href: "/naming/", icon: BookOpen, tag: "宝宝起名", title: "宝宝起名", desc: "结合生辰八字、五行喜用，为宝宝取一个好名字。" },
  { href: "/meditation/", icon: Flame, tag: "静心修禅", title: "静心禅坐", desc: "放下执念，静心观呼吸。在线禅修计时与引导。" },
];

const reasons = [
  { title: "古籍为根", desc: "解读围绕《渊海子平》《滴天髓》《周易》等经典展开，引文皆有出处。" },
  { title: "师父开示", desc: "三位虚拟师父分别擅长稳重派、慈悲派与直爽派，选适合您的来听。" },
  { title: "心诚为本", desc: "网站不替代医疗、法律、投资建议。一切结果，仅作传统文化参考。" },
];

const quotes = [
  "善念起于心，福缘自然生。一念清净，万物皆宁。",
  "菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。",
  "一切有为法，如梦幻泡影。如露亦如电，应作如是观。",
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      {/* Hero */}
      <section className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 px-2 text-center">
        <div className="space-y-5 animate-float-up">
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full border border-purple/40 bg-purple/10">
            <Flame className="size-12 text-gold" />
            <span className="absolute inset-0 rounded-full" style={{border:'1.5px solid rgba(107,63,160,0.5)',animation:'ring-expand 3s ease-out infinite'}} />
            <span className="absolute inset-0 rounded-full" style={{border:'1px solid rgba(212,168,67,0.3)',animation:'ring-expand 3s ease-out infinite 1.5s'}} />
          </div>
          <h1 className="text-6xl tracking-widest md:text-7xl" style={{
            fontFamily:"'ZhiMangXing',cursive",
            background:"linear-gradient(180deg,#e0d5ff 0%,#d4a843 50%,#8b6914 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            filter:"drop-shadow(0 2px 8px rgba(107,63,160,0.4))"
          }}>心诚堂</h1>
          <p className="mx-auto max-w-md text-base leading-loose text-paper-dark/85 md:text-lg">
            以古籍为根，以师父为引<br/>
            <span className="text-star/80">心诚则灵 · 一念慈悲 · 福报自来</span>
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0 animate-float-up" style={{animationDelay:'0.15s'}}>
          <a href="/qifu/" className="w-full sm:w-auto">
            <button className="h-12 px-8 w-full sm:w-auto rounded-lg bg-vermillion text-white text-lg tracking-wider shadow-lg shadow-vermillion/30 hover:bg-vermillion-light flex items-center justify-center gap-2">
              <Heart className="size-5" /> 为家人祈福
            </button>
          </a>
          <a href="/bazi/" className="w-full sm:w-auto">
            <button className="h-12 px-8 w-full sm:w-auto rounded-lg border border-gold/40 text-gold text-lg hover:bg-gold/10 flex items-center justify-center gap-2">
              <Compass className="size-5" /> 大师八字精批
            </button>
          </a>
        </div>
      </section>

      {/* 九大善门 */}
      <section className="space-y-6 pb-section">
        <h2 className="text-center text-3xl tracking-widest" style={{
          background:"linear-gradient(90deg,#d4a843,#f5e6b8,#d4a843)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
        }}>九大善门</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <a key={i} href={c.href}>
                <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 shadow-paper backdrop-blur-sm hover:border-purple/40 hover:shadow-purple transition-all space-y-3 h-full">
                  <div className="flex items-center justify-between">
                    <Icon className="size-8 text-gold" />
                    <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold/80">{c.tag}</span>
                  </div>
                  <h3 className="text-2xl text-paper-dark">{c.title}</h3>
                  <p className="text-base text-paper-dark/80">{c.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 为何选心诚堂 */}
      <section className="space-y-6 pb-section">
        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 text-center space-y-4">
          <span className="inline-flex items-center rounded-full border border-purple/30 bg-gradient-to-r from-purple/20 to-gold/10 px-2.5 py-1 text-xs text-star">
            真排盘 · 古籍为据 · 师父开示
          </span>
          <h2 className="text-2xl tracking-widest md:text-3xl" style={{
            background:"linear-gradient(90deg,#d4a843,#f5e6b8,#d4a843)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
          }}>为何选心诚堂</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((f, i) => (
              <div key={i} className="rounded-lg border border-purple/15 bg-xuan-surface/40 p-4 text-left">
                <p className="font-display text-lg text-gold">{f.title}</p>
                <p className="mt-2 text-sm text-paper-dark/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 在线上香 */}
      <section className="space-y-6 pb-section">
        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-8 text-center space-y-4">
          <h2 className="text-2xl tracking-widest" style={{
            background:"linear-gradient(90deg,#d4a843,#f5e6b8,#d4a843)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
          }}>在线上香</h2>
          <p className="text-paper-dark/70 max-w-md mx-auto">心诚则灵，一炷清香，一片诚心。在线点香祈福，为家人送上最真挚的祝福。</p>
          <a href="/qifu/">
            <button className="h-12 px-8 rounded-lg bg-vermillion text-white text-lg tracking-wider shadow-lg shadow-vermillion/30 hover:bg-vermillion-light inline-flex items-center gap-2">
              <Flame className="size-5" /> 立即上香祈福
            </button>
          </a>
        </div>
      </section>

      {/* 分享传播 */}
      <section className="space-y-6 pb-section">
        <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-8 text-center space-y-4">
          <h2 className="text-2xl tracking-widest" style={{
            background:"linear-gradient(90deg,#d4a843,#f5e6b8,#d4a843)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
          }}>分享传播</h2>
          <p className="text-paper-dark/70 max-w-md mx-auto">好东西要与亲友分享。把心诚堂推荐给身边的人，让更多人受益于传统文化智慧。</p>
          <button className="h-10 px-6 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 inline-flex items-center gap-2">
            <Sparkles className="size-4" /> 分享给好友
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="space-y-5 border-t border-purple/10 pt-10 text-center text-sm">
        {quotes.map((q, i) => (
          <p key={i} className={`leading-loose ${i === 0 ? 'text-gold/80' : i === 1 ? 'text-paper-dark/65' : 'text-star/50'}`}>{q}</p>
        ))}
        <div className="mx-auto w-12 border-t border-purple/15" />
        <p className="text-xs text-paper-dark/60">心诚堂 · 一念慈悲，一灯长明</p>
      </footer>
    </div>
  );
}
