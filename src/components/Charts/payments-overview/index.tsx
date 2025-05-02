"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getNetworkTrafficData } from "@/services/api.services";
import { NetworkTrafficChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function PaymentsOverview({ timeFrame = "monthly", className }: PropsType) {
  const [data, setData] = useState<{ timestamp: string; rate: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getNetworkTrafficData();
        setData((prevData) => [
          ...prevData,
          { timestamp: newData.timestamp, rate: newData.traffic },
        ]);
      } catch (error) {
        console.error("Failed to fetch network traffic data:", error);
      }
    };

    // Fetch data every second
    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Network Traffic Overview
        </h2>
      </div>

      <NetworkTrafficChart
        data={{
          traffic: data.map((point) => ({
            timestamp: point.timestamp,
            rate: point.rate,
          })),
        }}
      />

      {/* Optional: Display summary */}
      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data.reduce((acc, { rate }) => acc + rate, 0)} counts
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Traffic</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data.length} timestamps
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Data Points</dd>
        </div>
      </dl>
    </div>
  );
}