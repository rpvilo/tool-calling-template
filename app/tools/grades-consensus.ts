import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";
import type { IntradayPriceSchema } from "./intraday-price";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get grades consensus for (e.g., AAPL, MSFT, GOOGL)"),
});

const gradesConsensusSchema = z.object({
  symbol: z.string(),
  strongBuy: z.number(),
  buy: z.number(),
  hold: z.number(),
  sell: z.number(),
  strongSell: z.number(),
  consensus: z.string(),
});

export type GradesConsensusSchema = z.infer<typeof gradesConsensusSchema>;

export const gradesConsensus = tool({
  description:
    "Get analyst consensus ratings (Strong Buy, Buy, Hold, Sell, Strong Sell) and overall consensus recommendation for a stock symbol",
  inputSchema,
  execute: async (payload) => {
    const [intradayPrice, gradesConsensus] = await Promise.all([
      fmpClient.fetch<IntradayPriceSchema[]>("/quote", { params: { symbol: payload.symbol } }),
      fmpClient.fetch<GradesConsensusSchema[]>("/grades-consensus", { params: payload }),
    ]);
    return {
      intraday: intradayPrice.at(0),
      gradesConsensus: gradesConsensus.at(0),
    };
  },
});
