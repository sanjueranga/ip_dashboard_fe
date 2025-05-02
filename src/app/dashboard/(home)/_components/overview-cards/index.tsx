"use client";

import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "@/services/api.services";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsGroup() {
  const [overviewData, setOverviewData] = useState({
    traffic: 0,
    users: 0,
    blockedIPs: 0,
    allowedUsers: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { traffic, users, blockedIPs, allowedUsers } = await getOverviewData();
        if (isMounted) {
          setOverviewData({ traffic, users, blockedIPs, allowedUsers });
        }
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      }
    };

    // Fetch data every second
    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => {
      isMounted = false; // Prevent state updates if the component is unmounted
      clearInterval(interval); // Cleanup interval on component unmount
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Current Traffic"
        data={{
          value: compactFormat(overviewData.traffic),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Current Users"
        data={{
          value: compactFormat(overviewData.users),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Blocked IPs"
        data={{
          value: compactFormat(overviewData.blockedIPs),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Allowed Users"
        data={{
          value: compactFormat(overviewData.allowedUsers),
        }}
        Icon={icons.Product}
      />
    </div>
  );
}