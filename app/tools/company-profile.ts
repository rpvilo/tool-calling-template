import { tool } from "ai";
import { z } from "zod";
import { fmpClient } from "@/lib/fmp-client";

const inputSchema = z.object({
  symbol: z
    .string()
    .describe("The stock symbol to get the company profile for (e.g., AAPL, MSFT, GOOGL)"),
});

export const companyProfileSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  marketCap: z.number(),
  beta: z.number(),
  lastDividend: z.number(),
  range: z.string(),
  change: z.number(),
  changePercentage: z.number(),
  volume: z.number(),
  averageVolume: z.number(),
  companyName: z.string(),
  currency: z.string(),
  cik: z.string(),
  isin: z.string(),
  cusip: z.string(),
  exchangeFullName: z.string(),
  exchange: z.string(),
  industry: z.string(),
  website: z.string(),
  description: z.string(),
  ceo: z.string(),
  sector: z.string(),
  country: z.string(),
  fullTimeEmployees: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  image: z.string(),
  ipoDate: z.string(),
  defaultImage: z.boolean(),
  isEtf: z.boolean(),
  isActivelyTrading: z.boolean(),
  isAdr: z.boolean(),
  isFund: z.boolean(),
});

export type CompanyProfileSchema = z.infer<typeof companyProfileSchema>;

export const companyProfile = tool({
  description:
    "Get comprehensive company profile information including company details, financial metrics, and business information",
  inputSchema,
  execute: async (payload) => {
    const data = await fmpClient.fetch<CompanyProfileSchema>("/profile", {
      params: payload,
    });

    return data;
  },
});
