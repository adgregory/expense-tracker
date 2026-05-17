"use client";

import { useState } from "react";
import { TimeRange } from "@/lib/types";
import { TimeRangeTabs } from "@/components/analytics/time-range-tabs";
import { CategoryDonut } from "@/components/analytics/category-donut";
import { DailySpendingChart } from "@/components/analytics/daily-spending-chart";
import { MonthComparison } from "@/components/analytics/month-comparison";
import { TopMerchants } from "@/components/analytics/top-merchants";
import { InsightCards } from "@/components/analytics/insight-cards";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  return (
    <div className="px-5 py-4 max-w-2xl mx-auto">
      <h1 className="text-[22px] font-bold tracking-tight mb-4">Analytics</h1>
      <div className="mb-5"><TimeRangeTabs selected={timeRange} onSelect={setTimeRange} /></div>
      <div className="space-y-4">
        <CategoryDonut />
        <DailySpendingChart />
        <MonthComparison />
        <TopMerchants />
        <InsightCards />
      </div>
    </div>
  );
}
