"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#services", label: "Services" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Plans" },
  { href: "#apply", label: "Contact" },
];

export default function FloatingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav className="glass backdrop-blur-2xl rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
          <a href="#" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            NutriCepss
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-neutral-300">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <ThemeToggle />
            <a href="#apply" className="hidden md:block bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-indigo-500 transition-colors">
              Apply Now
            </a>
            <button onClick={() => setOpen(!open)} className="md:hidden text-slate-700 dark:text-white">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-4 right-4 z-50 glass backdrop-blur-2xl rounded-3xl p-6 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg font-medium text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#apply" onClick={() => setOpen(false)} className="bg-indigo-600 text-white px-5 py-3 rounded-full text-sm font-bold text-center">
              Apply Now
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}
