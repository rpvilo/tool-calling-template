"use client";

import { Fragment, memo, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EarningsHistoricalSchema } from "@/app/tools/earnings-historical";
import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import { cn, formatPercentage, formatQuarter } from "@/lib/utils";
import { GlassFrame } from "../glass-frame";
import SymbolHeader from "../symbol-header";
import { Separator } from "../ui/separator";

const COLORS = {
  beat: {
    stroke: "var(--color-jade-10)",
    fill: "var(--color-jade-9)",
  },
  missed: {
    stroke: "var(--color-ruby-10)",
    fill: "var(--color-ruby-9)",
  },
  gray: {
    stroke: "var(--color-gray-10)",
    fill: "var(--color-gray-11)",
  },
};

const getExpectation = (
  epsActual: number | null,
  epsEstimated: number | null,
): "beat" | "missed" | null => {
  if (!epsActual || !epsEstimated) return null;
  return epsActual >= epsEstimated ? "beat" : "missed";
};

// Calculate percentage difference
const calculatePercentageDiff = (
  actual: number | null,
  estimated: number | null,
): number | null => {
  if (!actual || !estimated || estimated === 0) return null;
  return ((actual - estimated) / estimated) * 100;
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const actual = data.epsActual;
  const estimated = data.epsEstimated;
  const expectation = data.expectation;
  const percentageDiff = calculatePercentageDiff(actual, estimated);

  if (!actual && !estimated) return null;

  return (
    <div className="w-52 select-none rounded-lg border border-gray-4 bg-gray-9 p-3 text-xs shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="font-medium text-gray-12 text-xs">{formatQuarter(data.date, "full")}</div>

        {actual && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-3 rounded-full border",
                  expectation === "beat"
                    ? "border-jade-10 bg-jade-10"
                    : "border-ruby-10 bg-ruby-10",
                )}
              />
              <span className="font-medium text-gray-11 text-xs">Actual</span>
            </div>
            <span className="font-medium text-gray-12 text-xs">${actual.toFixed(2)}</span>
          </div>
        )}
        {estimated && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full border border-gray-11 border-dashed bg-gray-10" />
              <span className="font-medium text-gray-11 text-xs">Expected</span>
            </div>
            <span className="font-medium text-gray-12 text-xs">${estimated.toFixed(2)}</span>
          </div>
        )}
        {percentageDiff && actual && estimated && (
          <Fragment>
            <Separator />
            <div className="flex items-center justify-between gap-2 font-medium">
              <span className="text-gray-11 text-xs">
                {expectation === "beat" ? "Beat" : "Missed"} expectations
              </span>
              <div
                className={`rounded px-1 py-0.5 font-medium text-xs ${
                  expectation === "beat" ? "bg-jade-4 text-jade-9" : "bg-ruby-4 text-ruby-9"
                }`}
              >
                {formatPercentage(percentageDiff)}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

type EarningsHistoricalChartProps = {
  data: {
    intraday?: IntradayPriceSchema;
    earnings?: EarningsHistoricalSchema[];
  };
};

export const EarningsHistoricalChart = memo(
  ({ data }: EarningsHistoricalChartProps) => {
    const { intraday, earnings } = data;

    const earningsData = useMemo(() => {
      if (!earnings) return [];

      return earnings
        .filter((item) => item.epsActual !== null || item.epsEstimated !== null)
        .sort((a, b) => {
          // Compare dates directly as strings first (faster)
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        })
        .map((item) => {
          return {
            symbol: item.symbol,
            date: item.date,
            quarterLabel: formatQuarter(item.date),
            epsActual: item.epsActual,
            epsEstimated: item.epsEstimated,
            expectation: getExpectation(item.epsActual, item.epsEstimated),
          };
        });
    }, [earnings]);

    if (!earningsData.length) {
      return <div className="my-8 text-center text-gray-500">No earnings data to display.</div>;
    }

    return (
      <GlassFrame>
        <div className="relative flex h-full w-full shrink-0 flex-col gap-3 overflow-hidden rounded-[12px] border border-gray-4 bg-gray-9">
          <SymbolHeader intraday={intraday} />
          <div className="min-h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={earningsData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                className="select-none"
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  vertical={false}
                  horizontal={true}
                  yAxisId="left"
                />

                <YAxis
                  hide
                  allowDecimals
                  // domain={(dataMin, dataMax) => {
                  //   const min = typeof dataMin === "number" ? dataMin : 0;
                  //   const max = typeof dataMax === "number" ? dataMax : 0;
                  //   const padding = (max - min) * 0.1; // 10% padding
                  //   return [Math.max(0, min - padding), max + padding];
                  // }}
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  orientation="left"
                />

                <XAxis
                  dataKey="quarterLabel"
                  interval={0}
                  height={48}
                  padding={{ left: 32, right: 32 }}
                  axisLine={false}
                  tickLine={false}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const dataPoint = earningsData[payload.index];
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={16}
                          textAnchor="middle"
                          fill="var(--color-gray-11)"
                          fontWeight={500}
                          fontSize={12}
                        >
                          {payload.value}
                        </text>
                        <text
                          x={0}
                          y={0}
                          dy={32}
                          textAnchor="middle"
                          fill={
                            dataPoint?.expectation === "beat"
                              ? COLORS.beat.fill
                              : dataPoint?.expectation === "missed"
                                ? COLORS.missed.fill
                                : COLORS.gray.fill
                          }
                          fontSize={11}
                          fontWeight={500}
                        >
                          {dataPoint?.expectation === "beat"
                            ? "Beat"
                            : dataPoint?.expectation === "missed"
                              ? "Missed"
                              : "-"}
                        </text>
                      </g>
                    );
                  }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  isAnimationActive={false}
                  wrapperStyle={{
                    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s",
                  }}
                />

                <Line
                  yAxisId="left"
                  dataKey="epsEstimated"
                  name="EPS Estimated"
                  strokeWidth={0}
                  dot={{
                    r: 8,
                    fill: "var(--color-gray-10)",
                    stroke: "var(--color-gray-11)",
                    strokeDasharray: "2 2",
                    strokeWidth: 1,
                  }}
                  activeDot={false}
                />
                <Line
                  yAxisId="left"
                  dataKey="epsActual"
                  fill="transparent"
                  stroke={COLORS.gray.stroke}
                  name="EPS Actual"
                  strokeWidth={0}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (!cx || !cy || payload?.epsActual === null) {
                      return null;
                    }
                    const color = payload?.expectation === "beat" ? COLORS.beat : COLORS.missed;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill={color.fill}
                        stroke={color.stroke}
                        strokeWidth={1}
                      />
                    );
                  }}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassFrame>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if earnings data actually changed
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  },
);

EarningsHistoricalChart.displayName = "EarningsHistoricalChart";
