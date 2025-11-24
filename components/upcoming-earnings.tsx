"use client";

import { format } from "date-fns";
import type { EarningsCalendarSchema } from "@/app/tools/earnings-calendar";

type Props = {
  data: EarningsCalendarSchema;
};

const UpcomingEarnings = ({ data }: Props) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-medium text-md">Upcoming Earnings</h2>
      <div className="flex flex-col gap-2">
        {data
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((item) => (
            <div
              key={item.symbol}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-3 bg-gray-9 p-2"
            >
              <img
                src={`https://img.logo.dev/ticker/${item.symbol}?token=pk_U3on09_rSvS4xP_cRHU4Dg`}
                alt={item.symbol}
                className="size-6 rounded-full shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06)]"
              />
              <h3 className="font-medium text-sm">{item.symbol}</h3>
              <span className="text-gray-11 text-xs">{format(item.date, "MMM d, yyyy")}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UpcomingEarnings;
