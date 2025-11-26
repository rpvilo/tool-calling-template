"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

type SeparatorBaseProps = {
  className?: string;
  decorative?: boolean;
} & Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, "orientation">;

type LineSeparatorProps = SeparatorBaseProps & {
  type?: "line";
  orientation: "horizontal" | "vertical";
};

type DotSeparatorProps = SeparatorBaseProps & {
  type?: "dot";
  orientation?: never;
};

type SeparatorProps = LineSeparatorProps | DotSeparatorProps;

const Separator = ({
  className,
  type = "line",
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) => {
  if (type === "dot") {
    return (
      <div className={cn("size-0.5 shrink-0 rounded-full bg-gray-11", className)} {...props} />
    );
  }

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-gray-4",
        orientation === "horizontal" ? "h-px w-full" : "h-auto w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
};

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
