import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z.string().describe("The stock symbol to get the quote for (e.g., AAPL, MSFT, GOOGL)"),
});

const responseSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  changePercentage: z.number(),
  change: z.number(),
  volume: z.number(),
  dayLow: z.number(),
  dayHigh: z.number(),
  yearHigh: z.number(),
  yearLow: z.number(),
  marketCap: z.number(),
  priceAvg50: z.number(),
  priceAvg200: z.number(),
  exchange: z.string(),
  open: z.number(),
  previousClose: z.number(),
  timestamp: z.number(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

export const intradayPrice = tool({
  description:
    "Get the current intraday quote for a stock symbol including price, change, volume, and other market data",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/quote", {
      params: payload,
    });

    return data;
  },
});
