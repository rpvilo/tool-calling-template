"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-clip-padding font-medium text-slate-12 text-sm transition-colors duration-150 hover:duration-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gray-9 text-gray-12 [box-shadow:0px_1px_3px_0px_rgba(0,0,0,0.16),0px_0px_0px_1px_rgba(0,0,0,0.08)_inset,0px_-1px_1px_0px_rgba(0,0,0,0.16)_inset] hover:bg-gray-10",
        contrast:
          "border-none bg-gray-12 pr-3 pl-4 text-gray-2 hover:bg-[color-mix(in_srgb,_var(--gray-12)_92%,_black)] hover:text-gray-1",
        ghost: "hover:bg-gray-10",
      },
      size: {
        xs: "h-6 gap-1 rounded-sm px-2 text-xs [&_svg]:size-3",
        sm: "h-7 gap-1.5 rounded-md px-3 text-xs [&_svg]:size-3",
        md: "h-8 gap-1.5 px-3 text-sm [&_svg]:size-4",
        lg: "h-9 gap-2 rounded-md px-3 text-sm [&_svg]:size-4",
        xl: "h-10 gap-2 rounded-md px-4 text-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
Button.displayName = "Button";

export { Button, buttonVariants };
