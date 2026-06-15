import { NextRequest, NextResponse } from "next/server";
import lotteryData from "@/data/lottery.json";
import mastersData from "@/data/masters.json";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { signNum, question, master, interpret } = body;

  // 获取签文数据
  const sign = lotteryData.find((s: any) => s.number === signNum) || lotteryData[0];

  // 如果只是获取签文，直接返回
  if (!interpret) {
    return NextResponse.json(sign);
  }

  // AI解读 - 流式输出
  const masterInfo = mastersData.find((m: any) => m.id === master) || mastersData[0];

  const systemPrompt = `${masterInfo.system_prompt}

你正在为求签者解签。

签文信息：
- 签号：第${sign.number}签
- 签名：${sign.title}
- 签诗：${sign.poem}
- 签意：${sign.meaning}

求签者的问题：${question}

请根据签文和求签者的问题，给出详细的解读。要求：
1. 先解释签诗的含义
2. 结合求签者的问题给出具体建议
3. 引用相关古籍或典故
4. 语言风格符合你的师父人设
5. 给出300-500字的解读`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请为我解签。我的问题是：${question}` },
      ],
      stream: true,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI服务暂不可用" }, { status: 500 });
  }

  // 流式返回
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
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {}
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
