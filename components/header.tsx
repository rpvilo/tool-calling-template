"use client";

import { motion } from "motion/react";
import { ProgressiveBlur } from "./progressive-blur";
import ThemeButton from "./theme-button";

const Header = () => {
  return (
    <header
      data-slot="header"
      className="fixed top-0 right-0 left-0 z-2 flex h-16 items-center bg-linear-to-b from-gray-1 to-transparent p-4"
    >
      <ProgressiveBlur direction="top" className="fixed top-0 right-0 left-0 h-14" />
      <motion.div
        initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-1 flex w-full items-center justify-end"
      >
        <ThemeButton />
      </motion.div>
    </header>
  );
};

export default Header;
