"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import GlassCard from "./GlassCard";

const plans = [
  {
    name: "Core",
    price: "₹4,999",
    desc: "For self-motivated individuals needing a strategic roadmap.",
    features: ["Custom Training Protocol", "Nutrition Framework", "Weekly Check-in", "Form Analysis"],
    featured: false,
  },
  {
    name: "Concierge",
    price: "₹9,999",
    desc: "Full-service management for maximum speed and accountability.",
    features: ["Everything in Core", "Daily WhatsApp Access", "Supplement Protocols", "Restaurant/Travel Guide", "Bi-Weekly Strategy Calls"],
    featured: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Investment.</h2>
          <p className="text-slate-600 dark:text-neutral-400">Choose the velocity of your transformation.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, delay: i * 0.15 }}
            >
              <GlassCard
                glow={plan.featured}
                className={plan.featured ? "bg-indigo-600/5 dark:bg-indigo-600/10" : ""}
              >
                {plan.featured && (
                  <>
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                      Most Popular
                    </div>
                  </>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-lg text-slate-400 dark:text-neutral-500 font-normal">/mo</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-400 mb-8">{plan.desc}</p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <div className={`rounded-full p-0.5 ${plan.featured ? "bg-indigo-500" : "bg-indigo-500/20"}`}>
                        <Check className={`w-3 h-3 ${plan.featured ? "text-white" : "text-indigo-500"}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${
                    plan.featured
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)]"
                      : "bg-black/5 dark:bg-white/10 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  {plan.featured ? "Apply for Concierge" : "Select Core"}
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
