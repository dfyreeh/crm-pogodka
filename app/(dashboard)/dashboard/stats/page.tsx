"use client";

import { useEffect, useState } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { Bot, CalendarClock, TrendingUp, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [seconds, setSeconds] = useState(15);
  const [pulse, setPulse] = useState(false);

  async function load() {
    setPulse(true); // включаем волну

    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {}

    setSeconds(15);

    // выключаем анимацию через 700мс
    setTimeout(() => setPulse(false), 700);
  }

  useEffect(() => {
    load();

    const dataInterval = setInterval(load, 15000);

    const countdownInterval = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  if (!stats)
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );

  return (
    <ProtectedPage allowedRoles={["admin", "editor", "viewer"]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Подзаголовок + индикатор пульса */}
        <h2 className="text-2xl font-bold">Дані в реальному часі</h2>
        <div className="flex items-center gap-1">
          <div
            className="relative top-0.5 w-2 h-2"
            role="status"
            aria-label="Активність"
          >
            {pulse && (
              <span className="absolute -inset-1 rounded-full bg-[#41b4d9] animate-ping opacity-75" />
            )}
            <span className="absolute inset-0 rounded-full bg-[#41b4d9]" />
          </div>
          <p className="text-sm opacity-70" aria-live="polite">
            Оновлюється {seconds}
          </p>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-cardgrid grid grid-cols-1 md:grid-cols-3 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs ">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Загальна кількість</CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  <CalendarClock />
                  {stats.today.requests}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Кількість відвідувань</CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  <User />
                  {stats.today.uniqueUsers}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Кількість ботів</CardDescription>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  <Bot />
                  {stats.today.bots}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
