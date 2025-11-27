import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { MoonIcon } from "./icons/moon-icon";
import { SunIcon } from "./icons/sun-icon";
import { IconButton } from "./ui/icon-button";

const MotionSunIcon = motion.create(SunIcon);
const MotionMoonIcon = motion.create(MoonIcon);

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <IconButton
      variant="ghost"
      size="md"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full hover:bg-gray-4 [&_svg]:fill-gray-11 hover:[&_svg]:fill-gray-12"
    >
      <AnimatePresence>
        {theme === "dark" ? (
          <MotionMoonIcon
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          />
        ) : (
          <MotionSunIcon
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>
    </IconButton>
  );
};

export default ThemeButton;
