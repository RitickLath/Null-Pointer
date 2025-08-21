"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FloatingIconProps {
  children: ReactNode;
  classname?: string;
}

const FloatingIcon = ({ children, classname = "" }: FloatingIconProps) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, 15, 14, 16, 0] }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        ease: "easeInOut",
      }}
      className={`${classname} absolute h-[30px] w-[30px]`}
    >
      {children}
    </motion.div>
  );
};

export default FloatingIcon;
