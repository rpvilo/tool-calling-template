import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
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

export const earningsCalendar = tool({
  description: "Get the earnings calendar showing upcoming earnings announcements for companies",
  inputSchema,
  execute: async (params) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/earnings-calendar", {
      params,
    });

    console.log(data);

    return data;
  },
});
