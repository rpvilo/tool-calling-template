import { format } from "date-fns";
import type { CompanyProfileSchema } from "@/app/tools/company-profile";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { GlassFrame } from "../glass-frame";
import SymbolHeader from "../symbol-header";

type CompanyProfileToolProps = {
  data: CompanyProfileSchema;
};

const MetricItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between bg-gray-9 p-3">
    <span className="text-gray-11 text-xs">{label}</span>
    <span className="font-medium text-gray-12 text-sm">{value}</span>
  </div>
);

export const CompanyProfileTool = ({ data }: CompanyProfileToolProps) => {
  const intraday = {
    symbol: data.symbol,
    name: data.companyName,
    exchange: data.exchange,
    price: data.price,
    change: data.change,
    changePercentage: data.changePercentage,
  };

  return (
    <GlassFrame>
      <div className="relative flex h-full w-full shrink-0 flex-col overflow-hidden rounded-[12px] border border-gray-4 bg-gray-9">
        <SymbolHeader intraday={intraday} />
        <div className="grid grid-cols-2 gap-px bg-gray-4 sm:grid-cols-3">
          <MetricItem label="Market Cap" value={formatCurrency(data.marketCap)} />
          <MetricItem
            label="52 Week Range"
            value={data.range
              .split("-")
              .map((value) => formatCurrency(Number(value)))
              .join(" - ")}
          />
          <MetricItem label="Average Volume" value={formatNumber(data.averageVolume)} />
          <MetricItem label="Beta" value={formatNumber(data.beta)} />
          <MetricItem
            label="Dividend"
            value={data.lastDividend ? formatCurrency(data.lastDividend) : "-"}
          />
          <MetricItem label="IPO Date" value={format(new Date(data.ipoDate), "MMM d, yyyy")} />
          <MetricItem label="Sector" value={data.sector ?? "-"} />
          <MetricItem label="Industry" value={data.industry ?? "-"} />
          <MetricItem label="CEO" value={data.ceo ?? "-"} />
          <MetricItem
            label="Employees"
            value={data.fullTimeEmployees ? formatNumber(Number(data.fullTimeEmployees)) : "-"}
          />
          <MetricItem label="Country" value={data.country ?? "-"} />
          <MetricItem label="Exchange" value={data.exchange ?? "-"} />
        </div>
        {data.description && (
          <div className="border-gray-4 border-t p-3">
            <p className="text-gray-11 text-xs/relaxed">{data.description}</p>
          </div>
        )}
      </div>
    </GlassFrame>
  );
};
