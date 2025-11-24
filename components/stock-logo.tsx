"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = {
  symbol: string;
} & ComponentProps<"img">;
const StockLogo = ({ symbol, className, ...props }: Props) => {
  return (
    <img
      src={`https://cdn.brandfetch.io/${symbol}?c=1idvu27mVmcQLrcnwHx`}
      // src={`https://img.logo.dev/ticker/${symbol}?token=pk_U3on09_rSvS4xP_cRHU4Dg`}
      alt={symbol}
      className={cn("size-5 rounded-sm", className)}
      {...props}
    />
  );
};

export default StockLogo;
