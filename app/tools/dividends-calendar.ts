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
  recordDate: z.string(),
  paymentDate: z.string(),
  declarationDate: z.string(),
  adjDividend: z.number(),
  dividend: z.number(),
  yield: z.number(),
  frequency: z.string(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

export const dividendsCalendar = tool({
  description:
    "Get the dividends calendar showing upcoming dividend payments and distributions for companies",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<ResponseSchema[]>("/dividends-calendar", {
      params: payload,
    });

    return data;
  },
});
