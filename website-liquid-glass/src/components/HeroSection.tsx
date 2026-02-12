"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative overflow-hidden">
      {/* Liquid gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: "var(--orb-1)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: "var(--orb-2)" }}
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full blur-[100px]"
          style={{ background: "var(--orb-3)" }}
        />
      </div>

      {/* Hero background image (subtle) */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/50 to-transparent" />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.15 }}
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        <motion.div
          variants={fadeUp}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass backdrop-blur-xl text-indigo-600 dark:text-indigo-300 text-xs font-medium uppercase tracking-wider"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Health & Lifestyle Consultant
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-neutral-500"
        >
          Elevate Your <br /> Health & Lifestyle
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          Certified Health & Lifestyle Consultant helping you achieve sustainable wellness through personalized nutrition, fitness, and mindset coaching.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a href="#apply" className="group relative px-8 py-4 bg-indigo-600 rounded-full font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
            <span className="relative z-10 flex items-center gap-2">
              Start Transformation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#results" className="px-8 py-4 rounded-full font-bold glass backdrop-blur-xl hover:scale-105 transition-all text-slate-800 dark:text-white">
            View Results
          </a>
        </motion.div>
      </motion.div>

      {/* Floating decorative glass card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
        className="absolute bottom-16 left-10 hidden lg:block"
      >
        <div className="p-4 rounded-2xl glass backdrop-blur-2xl w-64">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold">Target Hit</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">12% Body Fat Reached</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
        className="absolute top-40 right-10 hidden lg:block"
      >
        <div className="p-4 rounded-2xl glass backdrop-blur-2xl w-56">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold">+54 Clients</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Transformations</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
