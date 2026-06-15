import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心诚堂 · 为家人祈福求灵签",
  description: "心诚则灵。为家人点一盏祈福灯，求一支关帝灵签，看一卦命理八字。一念慈悲，福报自来。",
  keywords: "心诚堂,祈福,求签,关帝灵签,八字精批,命理",
  openGraph: {
    title: "心诚堂 · 为家人祈福求灵签",
    description: "心诚则灵。点一盏灯，求一支签，看一卦命。一念慈悲，福报自来。",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* 背景层 - 深紫星空 */}
        <div className="fixed inset-0 z-0" style={{
          background: "linear-gradient(180deg, #0d0a1a 0%, #151029 40%, #1a1435 70%, #0d0a1a 100%)"
        }} />
        
        {/* 星空效果 */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {Array.from({length: 30}).map((_, i) => (
            <span key={i} className="absolute rounded-full bg-star/40 animate-star-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }} />
          ))}
        </div>

        {/* 紫色光晕 */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(107,63,160,0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(155,109,215,0.08) 0%, transparent 40%), radial-gradient(ellipse at 80% 60%, rgba(107,63,160,0.1) 0%, transparent 40%)"
        }} />

        {/* 顶部金色光 */}
        <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/10 to-transparent" />
        
        {/* 浮动光点 */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {[{l:'15%',t:'25%',d:'0s'},{l:'35%',t:'60%',d:'1.5s'},{l:'55%',t:'35%',d:'2.8s'},{l:'75%',t:'70%',d:'0.8s'},{l:'88%',t:'20%',d:'3.5s'}].map((p,i) => (
            <span key={i} className="absolute size-1.5 rounded-full bg-purple/50 animate-glow-rise"
              style={{left:p.l,top:p.t,animationDelay:p.d,animationDuration:'5s',animationIterationCount:'infinite'}} />
          ))}
        </div>

        {/* 导航 */}
        <header className="fixed top-0 z-50 h-14 w-full bg-transparent">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
            <a className="flex items-center gap-2.5" href="/">
              <span className="text-2xl" style={{
                fontFamily:"'ZhiMangXing',cursive",
                background:"linear-gradient(180deg, #e0d5ff 0%, #d4a843 50%, #8b6914 100%)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                letterSpacing:"0.12em"
              }}>心诚堂</span>
            </a>
            <nav className="hidden items-center gap-5 md:flex">
              {[
                {href:"/qifu/",label:"为家人祈福"},
                {href:"/lottery/",label:"求灵签"},
                {href:"/bazi/",label:"八字精批"},
              ].map(l => (
                <a key={l.href} className="text-sm text-paper-dark hover:text-gold transition-colors" href={l.href}>{l.label}</a>
              ))}
            </nav>
          </div>
          <div className="gold-divider opacity-0 transition-opacity" />
        </header>

        {/* 主内容 */}
        <main className="relative z-10 mx-auto min-h-screen w-full pt-14 pb-24 md:pb-8">
          {children}
        </main>

        {/* 底部导航（移动端） */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-purple/20 bg-xuan-card/97 backdrop-blur-md md:hidden">
          <div className="grid grid-cols-3 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
            {[
              {href:"/",label:"首页",icon:"🔮"},
              {href:"/qifu/",label:"祈福",icon:"🕯️"},
              {href:"/lottery/",label:"灵签",icon:"📜"},
            ].map(n => (
              <a key={n.href} className="flex flex-col items-center gap-0.5 py-2 text-xs text-paper-dark" href={n.href}>
                <span className="text-lg">{n.icon}</span>
                <span className="text-[11px]">{n.label}</span>
              </a>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
