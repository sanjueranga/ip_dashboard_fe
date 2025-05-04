"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getTopClients } from "@/services/api.services";
import { WeeksProfitChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function WeeksProfit({ className, timeFrame }: PropsType) {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getTopClients();
        setData(newData);
      } catch (error) {
        console.error("Failed to fetch top clients data:", error);
      }
    };

    // Fetch data initially and every 10 seconds
    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Top Clients
        </h2>
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}