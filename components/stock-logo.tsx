"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = {
  symbol: string;
} & ComponentProps<"img">;
const StockLogo = ({ symbol, className, ...props }: Props) => {
  const { theme } = useTheme();
  return (
    <div className={cn("relative size-5 overflow-hidden rounded-sm", className)}>
      <img
        // src={`https://cdn.brandfetch.io/${symbol}?c=1idvu27mVmcQLrcnwHx`}
        src={`https://img.logo.dev/ticker/${symbol}?token=pk_U3on09_rSvS4xP_cRHU4Dg&format=png&fallback=404&size=64&theme=${theme}`}
        alt={symbol}
        className={cn("size-full object-contain")}
        {...props}
      />
    </div>
  );
};

export default StockLogo;
