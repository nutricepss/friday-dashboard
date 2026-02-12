"use client";

import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

const inputClass =
  "w-full bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-sm transition-all";

export default function ContactForm() {
  return (
    <section id="apply" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Begin.</h2>
          <p className="text-slate-600 dark:text-neutral-400">Start your transformation journey today.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
        >
          <GlassCard hover={false} className="backdrop-blur-2xl p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 dark:text-neutral-500 tracking-wider">Name</label>
                  <input type="text" className={inputClass} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 dark:text-neutral-500 tracking-wider">Email</label>
                  <input type="email" className={inputClass} placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-neutral-500 tracking-wider">Goal</label>
                <select className={`${inputClass} appearance-none`}>
                  <option value="">Fat Loss & Aesthetics</option>
                  <option value="">Muscle & Strength</option>
                  <option value="">Lifestyle Optimization</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-neutral-500 tracking-wider">Your Story</label>
                <textarea rows={4} className={inputClass} placeholder="What have you tried before?" />
              </div>
              <button
                type="submit"
                className="w-full py-5 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:scale-[1.02]"
              >
                Submit Application
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
