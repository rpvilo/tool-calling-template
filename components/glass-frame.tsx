import { motion } from "motion/react";

export const GlassFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
      exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative p-1"
    >
      <div className="absolute inset-0 size-full rounded-[16px] border border-gray-3/50 bg-gray-2/50 brightness-97 backdrop-blur-[2px] dark:brightness-90" />
      {children}
    </motion.div>
  );
};
