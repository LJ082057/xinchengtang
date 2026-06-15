# 心诚堂 项目文档

## 项目概述
- **名称**: 心诚堂（命理网站）
- **地址**: https://xinchengtang.pages.dev
- **GitHub**: https://github.com/LJ082057/xinchengtang
- **本地路径**: D:\AI\putiyuan (WSL: /mnt/d/AI/putiyuan)
- **技术栈**: Next.js 14 + Tailwind CSS + Cloudflare Pages + Cloudflare Workers
- **AI**: DeepSeek API (deepseek-chat + deepseek-reasoner)

## 部署架构
- **前端**: Next.js 静态导出，部署到 Cloudflare Pages
- **API**: Cloudflare Workers (_worker.js) 处理 /api/* 路由
- **静态文件**: Cloudflare Pages 直接 serve
- **构建**: WSL 环境用 `/home/ccq28/.local/bin/node node_modules/next/dist/bin/next build`
- **部署命令**: `npx wrangler pages deploy /tmp/cf-deploy --project-name=xinchengtang --branch=main`

## 重要凭证
- **GitHub Token**: （存在本地，不提交到GitHub）
- **Cloudflare API Token**: （存在本地，不提交到GitHub）
- **Cloudflare Account ID**: d860e65595583e092dc49a54b81f4fcc
- **DeepSeek API Key**: （存在Cloudflare Pages环境变量中）
- **Vercel Token**: （备用，存在本地）

## 项目结构
```
D:\AI\putiyuan\
├── app/
│   ├── layout.tsx          # 主布局（导航、底部栏、背景）
│   ├── page.tsx            # 首页（九大善门）
│   ├── globals.css         # 全局样式
│   ├── components/
│   │   ├── MusicToggle.tsx # 音乐播放器
│   │   ├── HeaderBg.tsx    # header滚动背景
│   │   └── ShareFAB.tsx    # 分享浮动按钮
│   ├── qifu/page.tsx       # 祈福页（功德灯墙）
│   ├── almanac/page.tsx    # 今日黄历
│   ├── dream/page.tsx      # 周公解梦
│   ├── lottery/page.tsx    # 关帝灵签
│   ├── bazi/page.tsx       # 八字精批
│   ├── divination/page.tsx # 六爻占卜
│   ├── palmistry/page.tsx  # 手相图解
│   ├── naming/page.tsx     # 宝宝起名
│   ├── meditation/page.tsx # 静心禅坐
│   └── profile/page.tsx    # 找回记录
├── data/
│   ├── lottery.json        # 100支关帝灵签
│   ├── masters.json        # 3位虚拟师父
│   ├── almanac.json        # 黄历数据
│   ├── dreams.json         # 梦境词典
│   └── naming.json         # 起名数据
├── public/
│   ├── buddhist-music.mp3  # 佛教纯音乐
│   ├── tip-qr.jpg          # 赞赏码
│   └── fonts/              # ZhiMangXing字体
├── tailwind.config.ts      # Tailwind配置（紫金色主题）
├── vercel.json             # Vercel配置（备用）
└── package.json
```

## 目标站参考
- **目标站**: https://putiyuan.pages.dev
- **品牌**: 目标站叫"菩提苑"，我们叫"心诚堂"
- **功能对比**:
  - ✅ 首页（九大善门）
  - ✅ 祈福（功德灯墙、灯型选择、赞赏码）
  - ✅ 今日黄历
  - ✅ 周公解梦（分类查梦、AI解梦）
  - ✅ 关帝灵签（100签、AI解签）
  - ✅ 八字精批（推理过程+详细分析）
  - ✅ 六爻占卜
  - ✅ 手相图解
  - ✅ 宝宝起名
  - ✅ 静心禅坐
  - ✅ 找回记录
  - ✅ 音乐播放器
  - ✅ 分享赚福报

## 部署流程（重要）
1. 构建: `cd /mnt/d/AI/putiyuan && rm -rf .next && mkdir -p .next && touch .next/trace && /home/ccq28/.local/bin/node node_modules/next/dist/bin/next build`
2. 准备部署目录:
   ```bash
   rm -rf /tmp/cf-deploy && mkdir -p /tmp/cf-deploy
   # 复制HTML页面
   for f in .next/server/app/*.html; do
     name=$(basename "$f" .html)
     if [ "$name" = "_not-found" ]; then cp "$f" /tmp/cf-deploy/404.html
     else mkdir -p "/tmp/cf-deploy/$name" && cp "$f" "/tmp/cf-deploy/$name/index.html"; fi
   done
   cp /tmp/cf-deploy/index/index.html /tmp/cf-deploy/index.html
   mkdir -p /tmp/cf-deploy/_next && cp -r .next/static /tmp/cf-deploy/_next/static
   cp -r public/* /tmp/cf-deploy/ 2>/dev/null
   ```
3. 创建 _worker.js（API路由处理）
4. 部署: `CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx wrangler pages deploy /tmp/cf-deploy --project-name=xinchengtang --branch=main --commit-dirty=true`

## 已知问题
1. **GitHub push偶尔超时** - 网络问题，多试几次或用Windows git
2. **WSL构建慢** - Next.js构建需要下载资源，国内网络可能超时
3. **Vercel部署404** - vercel.json已精简，但未验证Vercel部署
4. **签文只有5条在Worker里** - 完整100条在data/lottery.json，但Worker内嵌了5条示例
5. **字体ZhiMangXing** - 需要fonts/ZhiMangXing-subset.woff2文件

## 设计规范
- **配色**: 深紫底(#0d0a1a) + 金色(#d4a843) + 朱红(#c23b22)
- **字体**: ZhiMangXing(标题) + Noto Serif SC(正文)
- **卡片**: border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper
- **按钮**: bg-vermillion(主) / border-gold/40 text-gold(次)
- **输入框**: focus:border-gold focus:ring-1 focus:ring-gold/30
- **底部栏**: 6格 grid-cols-6，emoji图标+13px文字

## 目标站逆向笔记
- 目标站用 Cloudflare Pages + Functions
- 有 PlayerProvider/MiniPlayer 组件（禅修音乐）
- 有 ShareFAB 组件（分享）
- 有 PageTransition 组件（页面进入动画 opacity:0→1）
- header滚动时加背景色
- 底部栏有emoji图标
- 祈福页有功德灯墙（模拟用户数据）
- 梦页按类查梦（动物/身体/自然/人物/物品/动作）
