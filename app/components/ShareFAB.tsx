"use client";

export default function ShareFAB() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "心诚堂 · 为家人祈福求灵签",
        text: "心诚则灵。点一盏灯，求一支签，看一卦命。一念慈悲，福报自来。",
        url: window.location.origin,
      }).catch(() => {});
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.origin).then(() => {
        alert("链接已复制，快去分享给好友吧！");
      }).catch(() => {});
    }
  };

  return (
    <button onClick={handleShare}
      className="fixed right-3 bottom-20 z-40 flex size-11 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-br from-gold/35 via-gold/20 to-vermillion/20 text-gold shadow-lg shadow-gold/20 backdrop-blur-sm active:scale-95 transition-all duration-fast md:hidden"
      title="分享赚福报金">
      <span className="text-lg">📤</span>
    </button>
  );
}
