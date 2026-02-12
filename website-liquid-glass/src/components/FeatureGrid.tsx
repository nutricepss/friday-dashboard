"use client";

import { motion } from "framer-motion";
import { Dumbbell, Apple, CalendarCheck, Activity, MessageCircle, TrendingUp } from "lucide-react";
import GlassCard from "./GlassCard";

const features = [
  { icon: Dumbbell, title: "Custom Training", desc: "Periodized programs built for your body, goals, and schedule." },
  { icon: Apple, title: "Nutrition Design", desc: "Macro frameworks that fit your lifestyle — no cookie-cutter diets." },
  { icon: CalendarCheck, title: "Weekly Check-ins", desc: "Data-driven reviews to keep you on the fastest path forward." },
  { icon: Activity, title: "Biofeedback Tracking", desc: "We monitor sleep, stress, and recovery to optimize every variable." },
  { icon: MessageCircle, title: "Direct Access", desc: "WhatsApp support so you're never guessing what to do next." },
  { icon: TrendingUp, title: "Progress Analytics", desc: "Visual dashboards showing your body composition trajectory." },
];

export default function FeatureGrid() {
  return (
    <section id="philosophy" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass backdrop-blur-xl text-indigo-600 dark:text-indigo-300 text-xs font-medium uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Our Philosophy
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Holistic Health <span className="text-slate-400 dark:text-neutral-500">Approach</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto">
            We integrate nutrition, fitness, and lifestyle design for sustainable wellness transformations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* About Himanshu section */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass backdrop-blur-xl text-indigo-600 dark:text-indigo-300 text-xs font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              About Himanshu
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">
              Certified Health & <span className="text-indigo-600 dark:text-indigo-400">Lifestyle Consultant</span>
            </h3>
            <p className="text-slate-600 dark:text-neutral-300 text-lg leading-relaxed">
              With years of experience in nutrition science and fitness coaching, I've helped hundreds of clients achieve sustainable health transformations.
            </p>
            <p className="text-slate-600 dark:text-neutral-300 text-lg leading-relaxed">
              My approach combines evidence-based nutrition, personalized training, and lifestyle optimization to create lasting results that fit your unique life.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                Nutrition Science
              </div>
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                Fitness Coaching
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-medium">
                Lifestyle Design
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative z-10 border border-black/5 dark:border-white/10 shadow-2xl">
              <img src="/images/portrait.jpg" alt="Himanshu - Health & Lifestyle Consultant" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-2xl font-bold">Himanshu Sharma</p>
                <p className="text-indigo-400 font-medium">Health & Lifestyle Consultant</p>
                <p className="text-sm text-neutral-300 mt-1">Founder, NutriCepss</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-full h-full rounded-[2rem] border border-black/5 dark:border-white/5 bg-indigo-500/5 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
