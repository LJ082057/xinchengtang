"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const RELATIONS = ["父亲","母亲","爱人","孩子","孙辈","朋友","自己"];

const LAMPS = [
  { id: "month", label: "一月灯", days: 30, price: "6.6", desc: "挂灯一月，日日受光" },
  { id: "hundred", label: "百日灯", days: 100, price: "19.9", desc: "百日长明，福泽绵延" },
  { id: "year", label: "一年灯", days: 365, price: "49.9", desc: "一年常照，阖家平安" },
  { id: "forever", label: "永久长明", days: 9999, price: "99", desc: "永久供灯，福报永续" },
];

// 模拟功德灯墙数据
const FAKE_WALL = [
  { name: "张*明", wish: "愿家人平安健康", time: "3分钟前", lamp: "百日灯" },
  { name: "李*华", wish: "孩子高考顺利", time: "8分钟前", lamp: "一年灯" },
  { name: "王*芳", wish: "母亲早日康复", time: "15分钟前", lamp: "永久长明" },
  { name: "陈*伟", wish: "事业顺利，财源广进", time: "22分钟前", lamp: "一月灯" },
  { name: "刘*婷", wish: "阖家平安，幸福美满", time: "31分钟前", lamp: "百日灯" },
  { name: "赵*龙", wish: "父母身体健康", time: "45分钟前", lamp: "一年灯" },
  { name: "孙*丽", wish: "婚姻美满，白头偕老", time: "1小时前", lamp: "永久长明" },
  { name: "周*强", wish: "生意兴隆，日进斗金", time: "1小时前", lamp: "百日灯" },
  { name: "吴*燕", wish: "孩子聪明伶俐", time: "2小时前", lamp: "一月灯" },
  { name: "郑*磊", wish: "家人出行平安", time: "2小时前", lamp: "一年灯" },
  { name: "黄*娟", wish: "心想事成，万事如意", time: "3小时前", lamp: "永久长明" },
  { name: "马*军", wish: "父母长寿安康", time: "3小时前", lamp: "百日灯" },
];

export default function QifuPage() {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [wish, setWish] = useState("");
  const [caller, setCaller] = useState("");
  const [selected, setSelected] = useState("month");
  const [lit, setLit] = useState(false);
  const [totalLit, setTotalLit] = useState(0);
  const [todayNew, setTodayNew] = useState(0);
  const [wall, setWall] = useState(FAKE_WALL);

  useEffect(() => {
    // 模拟加载数据
    setTotalLit(2847);
    setTodayNew(23);
  }, []);

  const lamp = LAMPS.find(l => l.id === selected);

  const handleLit = () => {
    if (!name.trim()) return;
    setLit(true);
    setTotalLit(prev => prev + 1);
    setTodayNew(prev => prev + 1);
    // 添加到灯墙
    setWall(prev => [
      { name: caller || "匿名善信", wish: wish || "阖家平安", time: "刚刚", lamp: lamp?.label || "一月灯" },
      ...prev.slice(0, 11),
    ]);
  };

  if (lit) {
    return (
      <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
        <section className="text-center space-y-4 pt-8">
          <div className="text-6xl animate-float-up">🕯️</div>
          <h2 className="font-display text-3xl tracking-widest text-gold gold-glow">灯已点亮</h2>
          <p className="text-lg text-paper-dark/85">
            {name} 的祈福灯已点亮<br/>
            {wish && <span className="text-base text-paper-dark/70">愿望：{wish}</span>}
          </p>
        </section>

        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper text-center space-y-3">
          <p className="text-gold">{lamp?.label} · ¥{lamp?.price}</p>
          <p className="text-sm text-paper-dark/70">长按识别赞赏码完成供灯</p>
          <div className="mx-auto w-48 h-48 rounded-lg border border-gold/30 bg-xuan-surface flex items-center justify-center overflow-hidden">
            <img src="/tip-qr.jpg" alt="赞赏码" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-paper-dark/50">付款后灯即刻生效，福报自来</p>
        </div>

        <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper text-center space-y-3">
          <p className="text-sm text-gold">🙏 分享给好友 · 赚福报金</p>
          <p className="text-xs text-paper-dark/70">分享给朋友，双方各得 1 福报金</p>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "心诚堂 · 为家人祈福", text: "我刚在心诚堂为家人点了一盏祈福灯，你也来吧！", url: window.location.origin + "/qifu/" }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.origin + "/qifu/").then(() => alert("链接已复制！"));
            }
          }} className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-all duration-fast active:scale-95">
            📤 分享赚福报
          </button>
        </div>

        <button onClick={() => { setLit(false); setName(""); setWish(""); setRelation(""); setCaller(""); }}
          className="w-full h-12 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-all duration-fast">
          再点一盏灯
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
      {/* 标题 */}
      <section className="text-center space-y-3 pt-6">
        <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
          <Heart className="size-10 text-vermillion" />
        </div>
        <h1 className="font-display text-4xl tracking-widest text-gold">为家人祈福</h1>
        <p className="text-base text-paper-dark/85">点一盏灯，挂家人之名，愿心愿成就，福寿安康。</p>
      </section>

      {/* 统计 */}
      <div className="mx-auto inline-flex items-center gap-4 rounded-full border border-gold/30 bg-xuan-card/70 px-6 py-2 text-sm text-paper-dark/85">
        <span>已点亮 <span className="text-gold font-number">{totalLit.toLocaleString()}</span> 盏</span>
        <span className="text-gold/30">|</span>
        <span>今日新增 <span className="text-gold font-number">{todayNew}</span> 盏</span>
      </div>

      {/* 为谁祈福 */}
      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
        <h2 className="font-display text-xl text-gold">为谁祈福</h2>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-base text-paper-dark/85">家人姓名</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full h-12 rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 text-base" />
          </div>
          <div className="space-y-2">
            <label className="text-base text-paper-dark/85">与您的关系</label>
            <div className="grid grid-cols-4 gap-2">
              {RELATIONS.map(r => (
                <button key={r} onClick={() => setRelation(r)}
                  className={`rounded-md border px-3 py-2 text-sm transition-all duration-fast ${
                    relation === r
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-gold/20 bg-xuan-surface text-paper-dark hover:border-gold/40"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 选灯 */}
      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
        <h2 className="font-display text-xl text-gold">选一盏灯</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {LAMPS.map(lamp => (
            <button key={lamp.id} onClick={() => setSelected(lamp.id)}
              className={`rounded-lg border p-4 text-left transition-all duration-base ${
                selected === lamp.id
                  ? "border-gold/60 bg-gold/10 shadow-gold"
                  : "border-gold/20 bg-xuan-surface/40 hover:border-gold/40"
              }`}>
              <div className="flex items-center justify-between">
                <p className="text-lg text-gold">{lamp.label}</p>
                <p className="text-2xl text-gold font-number">¥{lamp.price}</p>
              </div>
              <p className="text-sm text-paper-dark/65 mt-1">{lamp.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 心愿 */}
      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
        <div className="space-y-2">
          <label className="text-base text-paper-dark/85">心愿（可选，最多 80 字）</label>
          <textarea value={wish} onChange={e => setWish(e.target.value.slice(0, 80))}
            placeholder="阖家平安、事业顺利..."
            rows={2}
            className="w-full rounded-md border border-gold/20 bg-xuan-surface px-3 py-2 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 text-base resize-none" />
        </div>
        <div className="space-y-2">
          <label className="text-base text-paper-dark/85">您的称呼（可选，会显示在灯墙）</label>
          <input value={caller} onChange={e => setCaller(e.target.value)}
            placeholder="匿名善信"
            className="w-full h-12 rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 text-base" />
        </div>
      </div>

      {/* 点灯按钮 */}
      <div className="space-y-2">
        <p className="text-center text-sm text-paper-dark/70">需供奉 <span className="text-gold font-number text-lg">¥{lamp?.price}</span></p>
        <button onClick={handleLit} disabled={!name.trim()}
          className="w-full h-14 rounded-lg bg-vermillion text-white text-xl tracking-wider shadow-lg shadow-vermillion/20 hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast">
          🕯️ 点亮此灯
        </button>
      </div>

      {/* 功德灯墙 */}
      <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-gold">功德灯墙</h2>
          <span className="text-xs text-paper-dark/50">姓名已脱敏处理 · 心诚则灵</span>
        </div>
        <div className="space-y-2">
          {wall.map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md border border-gold/10 bg-xuan-surface/30 px-3 py-2">
              <span className="text-lg">🕯️</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gold">{w.name}</span>
                  <span className="text-xs text-paper-dark/50">{w.lamp}</span>
                </div>
                <p className="text-sm text-paper-dark/70 truncate">{w.wish}</p>
              </div>
              <span className="text-xs text-paper-dark/40 whitespace-nowrap">{w.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
