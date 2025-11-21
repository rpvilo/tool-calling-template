import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  ticker: z.string().describe("The ticker symbol of the company to get the earnings calendar for"),
  from: z
    .string()
    .optional()
    .describe("Start date in YYYY-MM-DD format (optional, defaults to today)"),
  to: z
    .string()
    .optional()
    .describe("End date in YYYY-MM-DD format (optional, defaults to 30 days from start)"),
});

const responseSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  epsActual: z.number(),
  epsEstimated: z.number(),
  revenueActual: z.number(),
  revenueEstimated: z.number(),
  lastUpdated: z.string(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

export const getEarningsCalendar = tool({
  description: "Get the earnings calendar showing upcoming earnings announcements for companies",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/earnings-calendar", {
      params: payload,
    });

    return z.array(responseSchema).parse(data);
  },
});
