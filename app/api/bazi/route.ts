import { NextRequest, NextResponse } from "next/server";
import mastersData from "@/data/masters.json";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

// 天干地支
const TIAN_GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const DI_ZHI = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const SHENG_XIAO = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];

// 简化的八字排盘（实际应该用更精确的算法）
function calculateBazi(year: number, month: number, day: number, hour: string) {
  const yearGan = TIAN_GAN[(year - 4) % 10];
  const yearZhi = DI_ZHI[(year - 4) % 12];
  const shengxiao = SHENG_XIAO[(year - 4) % 12];

  // 月柱（简化）
  const monthGan = TIAN_GAN[((year - 4) % 10) * 2 + month % 10];
  const monthZhi = DI_ZHI[(month + 1) % 12];

  // 日柱（简化，实际需要万年历）
  const dayGan = TIAN_GAN[(year * 5 + Math.floor(year / 4) + month * 2 + day) % 10];
  const dayZhi = DI_ZHI[(year * 5 + Math.floor(year / 4) + month * 2 + day) % 12];

  // 时柱
  const hourMap: Record<string, number> = {zi:0,chou:1,yin:2,mao:3,chen:4,si:5,wu:6,wei:7,shen:8,you:9,xu:10,hai:11};
  const hourIdx = hourMap[hour] || 0;
  const hourGan = TIAN_GAN[(dayGan.charCodeAt(0) % 10 * 2 + hourIdx) % 10];
  const hourZhi = DI_ZHI[hourIdx];

  return {
    yearPillar: yearGan + yearZhi,
    monthPillar: monthGan + monthZhi,
    dayPillar: dayGan + dayZhi,
    hourPillar: hourGan + hourZhi,
    shengxiao,
    yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, day, hour, gender, master } = body;

  const masterInfo = mastersData.find((m: any) => m.id === master) || mastersData[0];
  const bazi = calculateBazi(year, month, day, hour);

  const systemPrompt = `${masterInfo.system_prompt}

你正在为一位求问者排八字命盘。

命盘信息：
- 四柱：年柱${bazi.yearPillar} 月柱${bazi.monthPillar} 日柱${bazi.dayPillar} 时柱${bazi.hourPillar}
- 生肖：${bazi.shengxiao}
- 性别：${gender === "male" ? "男" : "女"}
- 出生：${year}年${month}月${day}日

请给出详细的八字分析，包括：
1. 日主分析（日干${bazi.dayGan}的特性）
2. 五行分析（金木水火土的旺衰）
3. 命格格局判断
4. 性格特点
5. 事业财运分析
6. 感情婚姻分析
7. 健康提醒
8. 近年流年运势
9. 开运建议

要求：
- 引用《渊海子平》《滴天髓》《三命通会》等古籍
- 语言风格符合你的师父人设
- 给出800-1200字的详细分析
- 先输出推理过程（用REASONING:前缀），再输出正式解读（用CONTENT:前缀）`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "请师父为我排盘分析。" },
      ],
      stream: true,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI服务暂不可用" }, { status: 500 });
  }

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
              // deepseek-reasoner的reasoning_content
              const reasoning = data.choices?.[0]?.delta?.reasoning_content;
              const content = data.choices?.[0]?.delta?.content;
              if (reasoning) {
                controller.enqueue(encoder.encode("REASONING:" + reasoning));
              }
              if (content) {
                controller.enqueue(encoder.encode("CONTENT:" + content));
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
