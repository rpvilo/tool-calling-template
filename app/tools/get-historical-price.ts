import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get historical prices for (e.g., AAPL, MSFT, GOOGL)"),
  from: z
    .string()
    .optional()
    .describe("Start date in YYYY-MM-DD format (optional, defaults to earliest available)"),
  to: z.string().optional().describe("End date in YYYY-MM-DD format (optional, defaults to today)"),
});

const responseSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  price: z.number(),
  volume: z.number(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

export const getHistoricalPrice = tool({
  description:
    "Get historical end-of-day (EOD) price data for a stock symbol within a selected date range",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/historical-price-eod/light", {
      params: payload,
    });

    return z.array(responseSchema).parse(data);
  },
});
