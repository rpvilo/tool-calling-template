import { tool } from "ai";
import { addDays, formatISO } from "date-fns";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  from: z.iso
    .date()
    .optional()
    .default(formatISO(new Date(), { representation: "date" }))
    .describe("Start date in YYYY-MM-DD format (optional, defaults to today)"),
  to: z.iso
    .date()
    .optional()
    .default(formatISO(addDays(new Date(), 30), { representation: "date" }))
    .describe("End date in YYYY-MM-DD format (optional, defaults to 30 days from start)"),
});

const earningsCalendarSchema = z.array(
  z.object({
    symbol: z.string(),
    date: z.string(),
    epsActual: z.number(),
    epsEstimated: z.number(),
    revenueActual: z.number(),
    revenueEstimated: z.number(),
    lastUpdated: z.string(),
  }),
);

export type EarningsCalendarSchema = z.infer<typeof earningsCalendarSchema>;

export const earningsCalendar = tool({
  description: "Get the earnings calendar showing upcoming earnings announcements for companies",
  inputSchema,
  execute: async (params) => {
    const data = await fmpClient.fetch<EarningsCalendarSchema>("/earnings-calendar", {
      params,
    });

    return data;
  },
});
