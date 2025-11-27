import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const GlassFrame = ({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.div> & { children?: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("relative p-1 backdrop-blur-xs", className)}
      {...props}
    >
      <div className="absolute inset-0 size-full rounded-[16px] border border-gray-3/50 bg-gray-1/50 brightness-90" />
      {children}
    </motion.div>
  );
};
