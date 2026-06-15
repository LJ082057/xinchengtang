import { NextRequest, NextResponse } from "next/server";
import dreamsData from "@/data/dreams.json";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  
  // Search local dream dictionary first
  const local = dreamsData.filter((d: any) => keyword.includes(d.keyword) || d.keyword.includes(keyword));
  const localMeanings = local.flatMap((d: any) => d.meanings);
  
  if (localMeanings.length > 0 && !DEEPSEEK_API_KEY) {
    return NextResponse.json({ source: "local", meanings: localMeanings });
  }

  // AI interpretation
  const systemPrompt = `你是周公解梦大师，精通《周公解梦》《梦林玄解》等古籍。用户描述一个梦境，请给出详细的解梦分析。
要求：
1. 先判断梦境的核心意象
2. 引用《周公解梦》原文
3. 从财运、事业、感情、健康四个方面分析
4. 给出化解建议
5. 300-500字`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `我梦见了：${keyword}。请帮我解梦。` }
      ],
      stream: true,
      max_tokens: 800,
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