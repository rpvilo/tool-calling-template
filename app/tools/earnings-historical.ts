import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";
import type { IntradayPriceSchema } from "./intraday-price";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get grades and historical for (e.g., AAPL, MSFT, GOOGL)"),
});

const earningsHistoricalSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  epsActual: z.number().nullable(),
  epsEstimated: z.number().nullable(),
  revenueActual: z.number().nullable(),
  revenueEstimated: z.number().nullable(),
  lastUpdated: z.string(),
});

export type EarningsHistoricalSchema = z.infer<typeof earningsHistoricalSchema>;

export const earningsHistorical = tool({
  description: "Get the latest earnings data for a stock symbol",
  inputSchema,
  execute: async (payload) => {
    const [intradayPrice, earningsHistorical] = await Promise.all([
      fmpClient.fetch<IntradayPriceSchema[]>("/quote", { params: { symbol: payload.symbol } }),
      fmpClient.fetch<EarningsHistoricalSchema[]>("/earnings", {
        params: payload,
      }),
    ]);

    return {
      intraday: intradayPrice.at(0),
      earnings: earningsHistorical.slice(0, 6).reverse(),
    };
  },
});
