"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export default function GlassCard({ children, className, glow, hover = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-[2rem] backdrop-blur-xl glass p-8 relative overflow-hidden",
        glow && "border-indigo-500/30 dark:border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]",
        className
      )}
      {...props}
    >
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
      {children}
    </motion.div>
  );
}
