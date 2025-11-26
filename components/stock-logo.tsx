"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { memo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  symbol: string;
} & ComponentProps<"img">;

const StockLogo = memo(
  ({ symbol, className, ...props }: Props) => {
    const { theme } = useTheme();
    return (
      <img
        src={`https://img.logo.dev/ticker/${symbol}?token=pk_U3on09_rSvS4xP_cRHU4Dg&format=png&fallback=404&size=64&theme=${theme}`}
        alt={symbol}
        className={cn("size-8 rounded-md object-contain", className)}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.symbol === nextProps.symbol && prevProps.className === nextProps.className;
  },
);

StockLogo.displayName = "StockLogo";

export default StockLogo;
