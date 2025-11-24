import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get grades and historical for (e.g., AAPL, MSFT, GOOGL)"),
});

const earningsHistoricalSchema = z.array(
  z.object({
    symbol: z.string(),
    date: z.string(),
    epsActual: z.number().nullable(),
    epsEstimated: z.number().nullable(),
    revenueActual: z.number().nullable(),
    revenueEstimated: z.number().nullable(),
    lastUpdated: z.string(),
  }),
);

export type EarningsHistoricalSchema = z.infer<typeof earningsHistoricalSchema>;

export const earningsHistorical = tool({
  description: "Get the latest analyst grades and historical ratings for a stock symbol",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<EarningsHistoricalSchema>("/earnings", {
      params: {
        symbol: payload.symbol,
        limit: 6,
      },
    });

    return data;
  },
});
