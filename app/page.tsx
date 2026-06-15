export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      {/* Hero */}
      <section className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 px-2 text-center">
        <div className="space-y-5 animate-float-up">
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full border border-purple/40 bg-purple/10">
            <span className="text-5xl">🔮</span>
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
            <button className="h-12 px-8 w-full sm:w-auto rounded-lg bg-purple text-white text-lg tracking-wider shadow-lg shadow-purple/30 hover:bg-purple-light">
              🕯️ 为家人祈福
            </button>
          </a>
          <a href="/bazi/" className="w-full sm:w-auto">
            <button className="h-12 px-8 w-full sm:w-auto rounded-lg border border-gold/40 text-gold text-lg hover:bg-gold/10">
              🔮 大师八字精批
            </button>
          </a>
        </div>
      </section>

      {/* 三大善门 */}
      <section className="space-y-6 pb-section">
        <h2 className="text-center text-3xl tracking-widest text-gold">✨ 三大善门 ✨</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {href:"/qifu/",icon:"🕯️",tag:"镇宅祈福",title:"为家人祈福",desc:"点一盏灯，挂家人姓名。心诚则灵，福报自来。"},
            {href:"/lottery/",icon:"📜",tag:"传统签谱",title:"关帝灵签",desc:"心诚则灵，一签一事。100支签文出自传统签谱。"},
            {href:"/bazi/",icon:"🔮",tag:"传家技艺",title:"八字精批",desc:"立春节气真排盘，看命格根骨与一生气运起伏。"},
          ].map((c,i) => (
            <a key={i} href={c.href}>
              <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 shadow-paper backdrop-blur-sm hover:border-purple/40 hover:shadow-purple transition-all space-y-3 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{c.icon}</span>
                  <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold/80">{c.tag}</span>
                </div>
                <h3 className="text-2xl text-paper-dark">{c.title}</h3>
                <p className="text-base text-paper-dark/80">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 为何选心诚堂 */}
      <section className="space-y-6 pb-section">
        <div className="rounded-lg border border-purple/20 bg-xuan-card/95 p-6 text-center space-y-4">
          <span className="inline-flex items-center rounded-full border border-purple/30 bg-gradient-to-r from-purple/20 to-gold/10 px-2.5 py-1 text-xs text-star">
            真排盘 · 古籍为据 · 师父开示
          </span>
          <h2 className="text-2xl tracking-widest text-gold md:text-3xl">为何选心诚堂</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {title:"古籍为根",desc:"解读围绕《渊海子平》《滴天髓》《周易》等经典展开，引文皆有出处。"},
              {title:"师父开示",desc:"三位虚拟师父分别擅长稳重派、慈悲派与直爽派，选适合您的来听。"},
              {title:"心诚为本",desc:"网站不替代医疗、法律、投资建议。一切结果，仅作传统文化参考。"},
            ].map((f,i) => (
              <div key={i} className="rounded-lg border border-purple/15 bg-xuan-surface/40 p-4 text-left">
                <p className="font-display text-lg text-gold">{f.title}</p>
                <p className="mt-2 text-sm text-paper-dark/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="space-y-5 border-t border-purple/10 pt-10 text-center text-sm">
        <p className="leading-loose text-gold/80">善念起于心，福缘自然生。一念清净，万物皆宁。</p>
        <p className="leading-loose text-paper-dark/65">菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。</p>
        <div className="mx-auto w-12 border-t border-purple/15" />
        <p className="text-xs text-paper-dark/60">心诚堂 · 一念慈悲，一灯长明</p>
      </footer>
    </div>
  );
}
