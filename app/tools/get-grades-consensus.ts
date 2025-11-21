import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get grades and consensus for (e.g., AAPL, MSFT, GOOGL)"),
});

const responseSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  analystRatingsBuy: z.number(),
  analystRatingsHold: z.number(),
  analystRatingsSell: z.number(),
  analystRatingsStrongSell: z.number(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

export const getGradesConsensus = tool({
  description: "Get analyst grades and consensus ratings for a stock symbol",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/grades-consensus", {
      params: payload,
    });

    return z.array(responseSchema).parse(data);
  },
});
