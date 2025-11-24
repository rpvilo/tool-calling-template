"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { GradesConsensusSchema } from "@/app/tools/grades-consensus";

type AnalystRatingChartProps = {
  data?: GradesConsensusSchema;
};

const LABELS = {
  strongBuy: "Strong Buy",
  buy: "Buy",
  hold: "Hold",
  sell: "Sell",
  strongSell: "Strong Sell",
} as const;

export const TEST_DATA = [
  {
    symbol: "AAPL",
    consensus: "Buy",
    strongBuy: 10,
    buy: 20,
    hold: 30,
    sell: 40,
    strongSell: 50,
  },
] satisfies GradesConsensusSchema;

const AnalystRatingChart = ({ data }: AnalystRatingChartProps) => {
  const [consensusData] = data ?? TEST_DATA;
  const { symbol, consensus, ...rest } = consensusData;

  const chartData = Object.entries(rest).map(([metric, value]) => ({
    metric,
    value,
    label: LABELS[metric as keyof typeof LABELS],
  }));

  return (
    <div className="flex h-72 w-3/4 flex-col">
      <div>
        <h2 className="font-medium text-md">Analyst Rating for {symbol}</h2>
        <p>{consensus}</p>
      </div>
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <Radar name="Rating" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
          <Tooltip
            formatter={(value: any) => value}
            labelFormatter={(label: any) => `Metric: ${label}`}
            isAnimationActive={false}
            wrapperStyle={{
              zIndex: 50,
              transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalystRatingChart;
