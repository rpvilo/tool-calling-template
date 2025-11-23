import type * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = ({ className, ...props }: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={cn(
        "field-sizing-content flex max-h-40 min-h-7 w-full resize-none rounded-md bg-transparent px-3 placeholder:text-gray-11/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
