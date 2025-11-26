import { tool } from "ai";
import { formatISO, subYears } from "date-fns";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";
import type { IntradayPriceSchema } from "./intraday-price";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get historical prices for (e.g., AAPL, MSFT, GOOGL)"),
  from: z
    .string()
    .optional()
    .describe("Start date in YYYY-MM-DD format (optional, defaults to earliest available)")
    .default(formatISO(subYears(new Date(), 1), { representation: "date" })),
  to: z
    .string()
    .optional()
    .describe("End date in YYYY-MM-DD format (optional, defaults to today)")
    .default(formatISO(new Date(), { representation: "date" })),
});

const historicalPriceSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  price: z.number(),
  volume: z.number(),
});

export type HistoricalPriceSchema = z.infer<typeof historicalPriceSchema>;

export const historicalPrices = tool({
  description:
    "Get historical end-of-day (EOD) prices and intraday quote data for a stock symbol within a selected date range. If no date range is provided, the default is the last year.",
  inputSchema,
  execute: async (payload) => {
    const [intradayPrice, historicalPrices] = await Promise.all([
      fmpClient.fetch<IntradayPriceSchema[]>("/quote", { params: { symbol: payload.symbol } }),
      fmpClient.fetch<HistoricalPriceSchema[]>("/historical-price-eod/light", { params: payload }),
    ]);

    return {
      intraday: intradayPrice.at(0),
      historical: historicalPrices,
    };
  },
});
