"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 border-t border-black/5 dark:border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-neutral-600">
          © 2026 NutriCepss | Health & Lifestyle Consulting. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-neutral-600">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Instagram</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Twitter</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
        </div>
      </div>
    </motion.footer>
  );
}
