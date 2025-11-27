"use client";

import { format } from "date-fns";
import { memo, useMemo } from "react";
import {
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoricalPriceSchema } from "@/app/tools/historical-prices";
import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { GlassFrame } from "../glass-frame";
import SymbolHeader from "../symbol-header";

type HistoricalPricesChartProps = {
  data?: {
    intraday?: IntradayPriceSchema;
    historical?: HistoricalPriceSchema[];
  };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="w-32 select-none rounded-lg border border-gray-4 bg-gray-9 p-2 text-xs shadow-lg">
      <div className="flex flex-col gap-1">
        <div className="font-medium text-gray-12 text-xs">{data.label}</div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-gray-11 text-xs">Price</span>
          <span className="font-medium text-gray-12 text-xs tabular-nums">
            {formatCurrency(data.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const HistoricalPricesChart = memo(
  ({ data }: HistoricalPricesChartProps) => {
    // Use test data if no data provided
    const intraday = data?.intraday;
    const historical = data?.historical;

    const previousClose = intraday?.previousClose ?? 0;

    const chartData = useMemo(() => {
      if (!historical || historical.length === 0) return [];
      return historical.toReversed().map((item) => {
        return {
          date: item.date,
          label: format(new Date(item.date), "dd MMM yyyy"),
          price: item.price,
        };
      });
    }, [historical]);

    // Calculate monthly ticks - centered in the middle of each month's data
    const monthlyTicks = useMemo(() => {
      if (chartData.length === 0) return [];

      // Group data points by month
      const monthGroups = new Map<string, string[]>();

      for (const item of chartData) {
        const monthKey = item.date.slice(0, 7); // "YYYY-MM"
        if (!monthGroups.has(monthKey)) {
          monthGroups.set(monthKey, []);
        }
        monthGroups.get(monthKey)!.push(item.date);
      }

      // Get the middle date of each month
      const ticks: string[] = [];
      for (const dates of monthGroups.values()) {
        const middleIndex = Math.floor(dates.length / 2);
        ticks.push(dates[middleIndex]);
      }

      return ticks;
    }, [chartData]);

    const priceLineColor =
      (chartData.at(0)?.price ?? 0) >= (chartData.at(-1)?.price ?? 0)
        ? "var(--color-ruby-9)"
        : "var(--color-jade-9)";

    // Calculate price range and ticks for Y-axis
    const { yAxisDomain, yAxisTicks } = useMemo(() => {
      const prices = chartData.map((d) => d.price);
      if (prices.length === 0) return { yAxisDomain: [0, 100], yAxisTicks: [] };

      const minPrice = Math.min(...prices, previousClose);
      const maxPrice = Math.max(...prices, previousClose);
      const range = maxPrice - minPrice;

      // Ensure we have some breathing room even when range is flat
      const fallbackPadding = Math.max(1, Math.abs(maxPrice) || 1) * 0.05;
      const padding = range === 0 ? fallbackPadding : range * 0.1;
      const domainMin = Math.max(0, minPrice - padding);
      const domainMax = maxPrice + padding;
      const domainSpan = Math.max(domainMax - domainMin, fallbackPadding);

      const tickCount = 5;
      const intervalCount = tickCount - 1;
      const rawStep = domainSpan / intervalCount || 1;

      // Round to a "nice" step value (1, 2, 5, 10, 20, 50, etc.)
      const magnitude = 10 ** Math.floor(Math.log10(rawStep));
      const normalized = rawStep / magnitude;
      const niceStep =
        normalized <= 1
          ? magnitude
          : normalized <= 2
            ? 2 * magnitude
            : normalized <= 5
              ? 5 * magnitude
              : 10 * magnitude;

      const totalSpan = niceStep * intervalCount;
      let tickStart = Math.floor(domainMin / niceStep) * niceStep;
      if (tickStart + totalSpan < domainMax) {
        tickStart = domainMax - totalSpan;
        tickStart = Math.floor(tickStart / niceStep) * niceStep;
      }

      const ticks = Array.from({ length: tickCount }, (_, index) =>
        Number((tickStart + index * niceStep).toFixed(2)),
      );

      return {
        yAxisDomain: [ticks.at(0) ?? minPrice, ticks.at(-1) ?? maxPrice],
        yAxisTicks: ticks,
      };
    }, [chartData, previousClose]);

    if (!intraday || !historical || historical.length === 0) {
      return (
        <div className="my-8 text-center text-gray-500">No historical price data to display.</div>
      );
    }

    return (
      <GlassFrame>
        <div className="relative flex h-full w-full shrink-0 flex-col gap-3 overflow-hidden rounded-[12px] border border-gray-4 bg-gray-2">
          <SymbolHeader intraday={intraday} />
          {/* Chart */}
          <div className="min-h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                className="group/chart select-none"
              >
                <CartesianGrid
                  horizontal
                  vertical={false}
                  stroke="var(--color-gray-4)"
                  strokeDasharray="2 2"
                />
                <ReferenceLine
                  className="opacity-100 transition-opacity duration-250 group-hover/chart:opacity-0"
                  y={previousClose}
                  stroke="var(--color-orange-11)"
                  strokeDasharray="2 2"
                />
                <YAxis
                  dataKey="price"
                  domain={yAxisDomain}
                  ticks={yAxisTicks}
                  orientation="right"
                  mirror
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--color-gray-11)",
                    fontSize: 12,
                    className:
                      "opacity-100 transition-opacity duration-250 group-hover/chart:opacity-0",
                  }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-gray-11)", fontSize: 12 }}
                  ticks={monthlyTicks}
                  tickFormatter={(value) => format(new Date(value), "MMM yy")}
                  angle={0}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "var(--color-gray-4)" }}
                  isAnimationActive={false}
                  wrapperStyle={{
                    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={priceLineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: priceLineColor,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Financial Metrics */}
          <div className="grid grid-cols-1 gap-px bg-gray-4 pt-px sm:grid-cols-3">
            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Prev Close</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatCurrency(previousClose)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Day Range</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatCurrency(intraday.dayLow)} - {formatCurrency(intraday.dayHigh)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Market Cap</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatCurrency(intraday.marketCap)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Open</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatCurrency(intraday.open)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Year Range</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatCurrency(intraday.yearLow)} - {formatCurrency(intraday.yearHigh)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-2 p-3">
              <span className="text-gray-11 text-xs">Volume</span>
              <span className="font-medium text-gray-12 text-sm">
                {formatNumber(intraday.volume)}
              </span>
            </div>
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

HistoricalPricesChart.displayName = "HistoricalPricesChart";
