import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

const TRIGRAMS = [
  { name: "乾", symbol: "☰", nature: "天", element: "金" },
  { name: "兑", symbol: "☱", nature: "泽", element: "金" },
  { name: "离", symbol: "☲", nature: "火", element: "火" },
  { name: "震", symbol: "☳", nature: "雷", element: "木" },
  { name: "巽", symbol: "☴", nature: "风", element: "木" },
  { name: "坎", symbol: "☵", nature: "水", element: "水" },
  { name: "艮", symbol: "☶", nature: "山", element: "土" },
  { name: "坤", symbol: "☷", nature: "地", element: "土" },
];

function throwCoins(): number[] {
  return Array.from({ length: 6 }, () => {
    const coins = Array.from({ length: 3 }, () => Math.random() > 0.5 ? 3 : 2);
    return coins.reduce((a, b) => a + b, 0);
  });
}

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const lines = throwCoins();
  const upper = TRIGRAMS[Math.floor(lines[0] * lines[1] / 9) % 8];
  const lower = TRIGRAMS[Math.floor(lines[2] * lines[3] / 9) % 8];

  const systemPrompt = `你是六爻占卜大师，精通《周易》《卜筮正宗》《增删卜易》。
求卜者的问题：${question}
本卦：上${upper.name}(${upper.symbol} ${upper.nature}) 下${lower.name}(${lower.symbol} ${lower.nature})
六爻值：${lines.join(", ")}

请给出详细的卦象分析：
1. 卦名和卦象解释
2. 六爻逐爻分析
3. 结合求卜者问题的具体判断
4. 应期预测
5. 行动建议
引用《周易》卦辞和爻辞。500-800字。`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请为我占卜。我的问题是：${question}` }
      ],
      stream: true,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) return NextResponse.json({ error: "AI服务暂不可用" }, { status: 500 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) { controller.close(); return; }
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(encoder.encode(content));
            } catch {}
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}