import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get grades and historical for (e.g., AAPL, MSFT, GOOGL)"),
});

const responseSchema = z.array(
  z.object({
    symbol: z.string(),
    date: z.string(),
    analystRatingsBuy: z.number(),
    analystRatingsHold: z.number(),
    analystRatingsSell: z.number(),
    analystRatingsStrongSell: z.number(),
  }),
);

export type ResponseSchema = z.infer<typeof responseSchema>;

export const gradesHistorical = tool({
  description: "Get the latest analyst grades and historical ratings for a stock symbol over time",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema>("/grades-historical", {
      params: {
        symbol: payload.symbol,
        limit: 6,
      },
    });

    return data;
  },
});
