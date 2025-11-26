"use client";

import { memo, useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { GradesConsensusSchema } from "@/app/tools/grades-consensus";
import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import { formatPercentage, pluralize } from "@/lib/utils";
import { GlassFrame } from "../glass-frame";
import SymbolHeader from "../symbol-header";

type AnalystRatingChartProps = {
  data: {
    intraday: IntradayPriceSchema;
    gradesConsensus: GradesConsensusSchema;
  };
};

const LABELS = {
  strongBuy: "Strong Buy",
  buy: "Buy",
  hold: "Hold",
  sell: "Sell",
  strongSell: "Strong Sell",
} as const;

const AnalystRatingChart = memo(
  ({ data }: AnalystRatingChartProps) => {
    const intraday = data.intraday;
    const gradesConsensus = data.gradesConsensus;

    // Define the desired order: Hold (top), Buy (top right), Strong Buy (bottom right), Strong Sell (bottom left), Sell (top left)
    const ORDER = ["hold", "buy", "strongBuy", "strongSell", "sell"] as const;

    const totalRatings = useMemo(() => {
      return ORDER.reduce((sum, metric) => sum + (gradesConsensus[metric] ?? 0), 0);
    }, [gradesConsensus]);

    const chartData = useMemo(() => {
      return ORDER.map((metric) => {
        const value = gradesConsensus[metric] ?? 0;
        const percentage = totalRatings > 0 ? (value / totalRatings) * 100 : 0;
        return {
          value,
          percentage,
          label: LABELS[metric],
          metric,
        };
      });
    }, [gradesConsensus, totalRatings]);

    const consensusLower = gradesConsensus.consensus.toLowerCase();

    const polygonColor = consensusLower.includes("buy")
      ? {
          stroke: "var(--color-jade-9)",
          fill: "var(--color-jade-9)",
        }
      : consensusLower.includes("sell")
        ? {
            stroke: "var(--color-ruby-9)",
            fill: "var(--color-ruby-9)",
          }
        : {
            stroke: "var(--color-gray-11)",
            fill: "var(--color-gray-11)",
          };

    return (
      <GlassFrame>
        <div className="relative flex h-full w-full shrink-0 flex-col gap-3 overflow-hidden rounded-[12px] border border-gray-4 bg-gray-9">
          <SymbolHeader intraday={intraday} />
          <div className="min-h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="75%">
                {/* Inner grid rings */}
                <PolarGrid
                  strokeDasharray="2 2"
                  stroke="currentColor"
                  strokeOpacity={0.15}
                  gridType="polygon"
                />
                <PolarAngleAxis
                  dataKey="label"
                  tickLine={false}
                  tick={(props) => {
                    const { x, y, payload, index, cx, cy } = props;
                    const dataPoint = chartData[index];
                    const value = dataPoint?.value ?? 0;
                    const showValue = value > 0;

                    // Calculate offset to push labels further out
                    if (
                      typeof x === "number" &&
                      typeof y === "number" &&
                      typeof cx === "number" &&
                      typeof cy === "number"
                    ) {
                      // Calculate angle and distance
                      const dx = x - cx;
                      const dy = y - cy;
                      const distance = Math.sqrt(dx * dx + dy * dy);
                      const angle = Math.atan2(dy, dx);

                      // Push labels further out by 15% of the distance
                      const labelOffset = distance * 0.2;
                      const labelX = x + Math.cos(angle) * labelOffset;
                      const labelY = y + Math.sin(angle) * labelOffset;

                      return (
                        <g transform={`translate(${labelX},${labelY})`}>
                          <text
                            x={0}
                            y={0}
                            textAnchor={"middle"}
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight={500}
                            fill="currentColor"
                            className="text-gray-11"
                          >
                            {payload.value}
                            {showValue ? (
                              <tspan className="text-gray-12">{` ${value}`}</tspan>
                            ) : (
                              <tspan className="text-gray-12">{" -"}</tspan>
                            )}
                          </text>
                        </g>
                      );
                    }

                    // Fallback without offset
                    return (
                      <g transform={`translate(${x ?? 0},${y ?? 0})`}>
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          fontSize={12}
                          fontWeight={500}
                          fill="currentColor"
                          className="text-gray-12"
                        >
                          {payload.value}
                          {showValue ? (
                            <tspan fill="var(--color-gray-11)" className="text-gray-11">
                              {`${value}`}
                            </tspan>
                          ) : (
                            <tspan fill="var(--color-gray-11)" className="text-gray-11">
                              {"-"}
                            </tspan>
                          )}
                        </text>
                      </g>
                    );
                  }}
                />
                {/* Custom outer ring */}
                <PolarGrid
                  strokeDasharray="none"
                  stroke="var(--color-gray-7)"
                  strokeOpacity={0.3}
                  gridType="polygon"
                  polarRadius={[1]}
                />
                <Radar
                  name="Rating"
                  dataKey="value"
                  stroke={polygonColor.stroke}
                  fill={polygonColor.fill}
                  fillOpacity={0.2}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: polygonColor.fill,
                    fillOpacity: 1,
                    stroke: polygonColor.stroke,
                    strokeWidth: 0,
                  }}
                  isAnimationActive={false}
                />
                <Tooltip
                  isAnimationActive={false}
                  cursor={false}
                  wrapperStyle={{
                    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s",
                  }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const data = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="flex flex-col gap-1 rounded-lg border border-gray-6 bg-gray-9 p-2 shadow-lg">
                        <p className="font-medium text-gray-12 text-xs">{data.label}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-medium text-gray-12 text-sm">
                            {formatPercentage(data.percentage, { signDisplay: "never" })}
                          </span>
                          <span className="text-gray-11 text-xs">
                            ({pluralize(data.value, "analyst")})
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassFrame>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if data actually changed
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  },
);

AnalystRatingChart.displayName = "AnalystRatingChart";

export default AnalystRatingChart;
