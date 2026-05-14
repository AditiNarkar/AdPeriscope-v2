"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trendData } from "@/lib/mock-data";

export function TrendChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={trendData}>
          <CartesianGrid stroke="#111" strokeDasharray="4 4" />
          <XAxis dataKey="name" stroke="#111" fontWeight={900} />
          <YAxis stroke="#111" fontWeight={900} />
          <Tooltip contentStyle={{ border: "4px solid #111", boxShadow: "6px 6px 0 #111", fontWeight: 800 }} />
          <Area dataKey="seo" stroke="#111" fill="#33d6ff" strokeWidth={3} />
          <Area dataKey="audience" stroke="#111" fill="#ff4ecd" strokeWidth={3} />
          <Area dataKey="content" stroke="#111" fill="#d7ff2f" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
