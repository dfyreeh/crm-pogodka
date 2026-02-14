import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const stats = await prisma.securityDailyStats.findFirst({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
    });

    const totalLogs = await prisma.securityRequestLog.count();

    return NextResponse.json({
      today: stats || {
        requests: 0,
        uniqueUsers: 0,
        bots: 0,
      },
      totalLogs,
    });
  } catch (e) {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
