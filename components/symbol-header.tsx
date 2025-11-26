import type { IntradayPriceSchema } from "@/app/tools/intraday-price";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import StockLogo from "./stock-logo";
import { Separator } from "./ui/separator";

type SymbolHeaderProps = {
  intraday?: IntradayPriceSchema;
};

const SymbolHeader = ({ intraday }: SymbolHeaderProps) => {
  if (!intraday) return null;

  const isPositive = intraday.change >= 0;
  const priceColor = isPositive ? "text-jade-10" : "text-ruby-10";

  return (
    <div className="flex justify-between border-gray-4 border-b p-3">
      <div className="flex items-center gap-2">
        <StockLogo symbol={intraday.symbol} className="size-8" />
        <div className="flex flex-col">
          <span className="font-medium text-md">{intraday.name}</span>
          <div className="flex items-center gap-1 font-medium text-gray-11 text-xs">
            <span>${intraday.symbol}</span>
            <Separator type="dot" />
            <span>{intraday.exchange}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold text-md">{formatCurrency(intraday.price)}</span>
        <div className="flex items-center gap-1">
          <span className={cn("font-medium text-xs", priceColor)}>
            {formatCurrency(intraday.change)}
          </span>
          <span className={cn("font-medium text-xs", priceColor)}>
            ({formatPercentage(intraday.changePercentage)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default SymbolHeader;
