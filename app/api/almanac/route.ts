import { NextResponse } from "next/server";
import almanacData from "@/data/almanac.json";

function getGanZhi(year: number, month: number, day: number) {
  const tg = almanacData.天干;
  const dz = almanacData.地支;
  const sx = almanacData.生肖;
  const yearGan = tg[(year - 4) % 10];
  const yearZhi = dz[(year - 4) % 12];
  const shengxiao = sx[(year - 4) % 12];
  const monthGan = tg[((year - 4) % 10 * 2 + month) % 10];
  const monthZhi = dz[(month + 1) % 12];
  const dayGan = tg[(year * 5 + Math.floor(year / 4) + month * 2 + day) % 10];
  const dayZhi = dz[(year * 5 + Math.floor(year / 4) + month * 2 + day) % 12];
  return {
    year: yearGan + yearZhi + "年",
    month: monthGan + monthZhi + "月",
    day: dayGan + dayZhi + "日",
    shengxiao,
    yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi
  };
}

export async function GET() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const ganzhi = getGanZhi(year, month, day);
  const dayIdx = (year * 5 + Math.floor(year / 4) + month * 2 + day) % 12;
  const yi = almanacData.宜.slice(0, 6);
  const ji = almanacData.忌.slice(0, 4);
  return NextResponse.json({ date: `${year}-${month}-${day}`, ganzhi, yi, ji, hours: almanacData.时辰 });
}