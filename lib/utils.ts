import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuarter(dateString: string, type: "short" | "full" = "short"): string {
  return format(new Date(dateString), type === "short" ? "QQQ yy" : "QQQ yyyy");
}

export function formatPercentage(
  percentage: number,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "always",
  },
) {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    ...options,
  }).format(percentage / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
}
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
};

export const pluralize = (
  count: number | string,
  word: string | [string, string],
  includeCount = true,
): string => {
  const numericCount = Number(count);

  if (Array.isArray(word)) {
    const [singular, plural] = word;
    const selectedWord = numericCount === 1 ? singular : plural;
    return `${includeCount ? count : ""} ${selectedWord}`;
  }

  if (numericCount === 1) {
    return `${includeCount ? count : ""} ${word}`;
  }

  return `${includeCount ? count : ""} ${word}s`;
};
