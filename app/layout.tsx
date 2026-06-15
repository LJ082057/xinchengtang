import type { Metadata, Viewport } from "next";
import "./globals.css";
import MusicToggle from "./components/MusicToggle";
import HeaderBg from "./components/HeaderBg";
import ShareFAB from "./components/ShareFAB";

export const metadata: Metadata = {
  title: "心诚堂 · 为家人祈福求灵签",
  description: "心诚则灵。为家人点一盏祈福灯，求一支关帝灵签，看一卦命理八字。一念慈悲，福报自来。",
  keywords: "心诚堂,祈福,求签,关帝灵签,八字精批,命理,周公解梦,今日黄历,六爻占卜,手相图解,宝宝起名",
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

const navLinks = [
  { href: "/qifu/", label: "祈福" },
  { href: "/almanac/", label: "今日黄历" },
  { href: "/dream/", label: "周公解梦" },
  { href: "/lottery/", label: "关帝灵签" },
  { href: "/bazi/", label: "八字精批" },
  { href: "/divination/", label: "六爻占卜" },
  { href: "/palmistry/", label: "手相图解" },
  { href: "/naming/", label: "宝宝起名" },
  { href: "/meditation/", label: "静心禅坐" },
];

const bottomTabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/qifu/", label: "祈福", icon: "🕯️" },
  { href: "/almanac/", label: "黄历", icon: "📅" },
  { href: "/lottery/", label: "灵签", icon: "📜" },
  { href: "/bazi/", label: "八字", icon: "🔮" },
  { href: "/dream/", label: "解梦", icon: "🌙" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* 背景层 */}
        <div className="fixed inset-0 z-0" style={{
          background: "linear-gradient(180deg, #0d0a1a 0%, #151029 40%, #1a1435 70%, #0d0a1a 100%)"
        }} />
        
        {/* 星空效果 */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {Array.from({length: 30}).map((_, i) => (
            <span key={i} className="absolute rounded-full bg-star/40 animate-star-twinkle"
              style={{
                left: `${(i * 3.33) % 100}%`,
                top: `${(i * 7.77) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                animationDelay: `${(i * 0.5) % 5}s`,
                animationDuration: `${(i % 3) + 2}s`,
              }} />
          ))}
        </div>

        {/* 紫色光晕 */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(107,63,160,0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(155,109,215,0.08) 0%, transparent 40%), radial-gradient(ellipse at 80% 60%, rgba(107,63,160,0.1) 0%, transparent 40%)"
        }} />

        {/* 顶部金色光 */}
        <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
        
        {/* 浮动光点 */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {[{l:'15%',t:'25%',d:'0s'},{l:'35%',t:'60%',d:'1.5s'},{l:'55%',t:'35%',d:'2.8s'},{l:'75%',t:'70%',d:'0.8s'},{l:'88%',t:'20%',d:'3.5s'}].map((p,i) => (
            <span key={i} className="absolute size-1.5 rounded-full bg-gold/40 animate-glow-rise"
              style={{left:p.l,top:p.t,animationDelay:p.d,animationDuration:'5s',animationIterationCount:'infinite'}} />
          ))}
        </div>

        {/* Header背景 - 滚动时显示 */}
        <HeaderBg />

        {/* 导航 */}
        <header className="fixed top-0 z-50 h-14 w-full transition-all duration-base safe-top bg-transparent">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
            <a className="flex items-center gap-2.5" href="/">
              <span style={{
                fontFamily:"'ZhiMangXing', cursive",
                fontSize:"1.6rem",
                background:"linear-gradient(180deg, #f5e6b8 0%, #c9a05c 50%, #8b6914 100%)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                backgroundClip:"text",color:"transparent",
                letterSpacing:"0.15em",
                filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.4))"
              }}>心诚堂</span>
            </a>
            <nav className="hidden items-center gap-5 md:flex">
              {navLinks.map(l => (
                <a key={l.href} className="font-body text-sm transition-colors duration-fast hover:text-gold text-paper-dark" href={l.href}>{l.label}</a>
              ))}
              <MusicToggle />
              <a href="/profile/" className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1.5 text-sm text-gold hover:bg-gold/10 transition-colors">
                找回记录
              </a>
            </nav>
            {/* 移动端：音乐按钮 */}
            <div className="flex items-center gap-2 md:hidden">
              <MusicToggle />
            </div>
          </div>
          <div className="gold-divider opacity-0 transition-opacity duration-slow" />
        </header>

        {/* 主内容 */}
        <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-20 md:pb-8">
          {children}
        </main>

        {/* ShareFAB - 分享赚福报 */}
        <ShareFAB />

        {/* 底部导航（移动端） */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-xuan-card/97 backdrop-blur-md md:hidden">
          <div className="grid grid-cols-6 px-0.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
            {bottomTabs.map(n => (
              <a key={n.href} className="flex flex-col items-center gap-0.5 py-1.5 text-paper-dark active:bg-gold/10 rounded-md transition-colors" href={n.href}>
                <span className="text-base">{n.icon}</span>
                <span className="text-[13px] font-medium">{n.label}</span>
              </a>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
