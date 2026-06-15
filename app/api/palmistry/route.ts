import { NextRequest, NextResponse } from 'next/server';
import mastersData from '@/data/masters.json';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { image, gender, master } = body;

  const masterInfo = mastersData.find((m: any) => m.id === master) || mastersData[0];

  const systemPrompt = `${masterInfo.system_prompt}

你精通手相学（掌相术），通读《麻衣神相》《柳庄相法》《相理衡真》等相学经典。你正在为一位善信看手相。

善信性别：${gender === 'male' ? '男' : '女'}

请根据上传的手掌照片，给出详细的手相分析，包括：
1. 掌型分析（金木水火土五种掌型）
2. 三大主线解读：
   - 生命线（长短、深浅、弧度）
   - 智慧线（长短、走向、分叉）
   - 感情线（深浅、末端走向）
3. 事业线、财运线分析
4. 婚姻线解读
5. 手指形态分析
6. 整体命运概述
7. 近期运势提醒
8. 开运建议

要求：
- 语言风格符合你的师父人设
- 引用相学古籍
- 给出600-1000字的详细分析
- 先输出推理过程（用REASONING:前缀），再输出正式解读（用CONTENT:前缀）`;

  const userContent: any[] = [
    { type: 'text', text: '请师父为我看手相。' },
  ];

  if (image) {
    userContent.push({
      type: 'image_url',
      image_url: { url: image },
    });
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      stream: true,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'AI服务暂不可用' }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) { controller.close(); return; }
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const reasoning = data.choices?.[0]?.delta?.reasoning_content;
              const content = data.choices?.[0]?.delta?.content;
              if (reasoning) {
                controller.enqueue(encoder.encode('REASONING:' + reasoning));
              }
              if (content) {
                controller.enqueue(encoder.encode('CONTENT:' + content));
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
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
