"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-gray-11 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-gray-4 bg-gray-9 shadow-xs hover:bg-gray-10",
        ghost: "hover:bg-gray-10 hover:text-gray-12",
      },
      size: {
        xs: "size-6 [&_svg]:size-3",
        sm: "size-7 [&_svg]:size-3",
        md: "size-8 [&_svg]:size-4",
        lg: "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export type IconButtonProps = VariantProps<typeof iconButtonVariants> & {
  isLoading?: boolean;
  asChild?: boolean;
} & React.ComponentProps<"button">;

const IconButton = ({
  type = "button",
  children,
  className,
  variant,
  size,
  isLoading = false,
  asChild = false,
  ...props
}: IconButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp type={type} className={cn(iconButtonVariants({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  );
};

IconButton.displayName = "Button";

export { IconButton, iconButtonVariants };
