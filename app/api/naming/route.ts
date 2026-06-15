import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

export async function POST(req: NextRequest) {
  const { surname, gender, year, month, day, hour } = await req.json();

  const systemPrompt = `你是一位精通姓名学的大师，结合八字五行、音韵学、诗词典故来起名。
要求：
1. 先分析八字五行喜忌
2. 推荐5个名字，每个名字包含：名字、五行属性、出处典故、寓意解释
3. 名字要朗朗上口，避免生僻字
4. 引用诗词典故增加文化底蕴
5. 500-800字`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `姓氏：${surname}，性别：${gender === "male" ? "男" : "女"}，出生：${year}年${month}月${day}日${hour}时。请推荐名字。` }
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