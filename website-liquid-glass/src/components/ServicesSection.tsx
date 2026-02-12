"use client";

import { motion } from "framer-motion";
import { Apple, Dumbbell, Users, Target, BarChart3, Heart } from "lucide-react";
import GlassCard from "./GlassCard";

const services = [
  {
    icon: Apple,
    title: "Personalized Nutrition Plans",
    description: "Custom macro frameworks tailored to your metabolism, lifestyle, and food preferences. No cookie-cutter diets.",
    features: ["Macro calculations", "Meal timing strategies", "Supplement guidance", "Weekly adjustments"],
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: Dumbbell,
    title: "Custom Workout Programs",
    description: "Periodized training plans designed for your body type, goals, and available equipment.",
    features: ["Strength & hypertrophy", "Mobility & recovery", "Home/gym variations", "Form optimization"],
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Users,
    title: "1-on-1 Coaching",
    description: "Direct access to Himanshu for personalized guidance, accountability, and strategy refinement.",
    features: ["Weekly check-ins", "WhatsApp support", "Video form reviews", "Mindset coaching"],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400"
  }
];

const benefits = [
  { icon: Target, title: "Goal-Oriented", description: "Clear milestones and measurable progress tracking" },
  { icon: BarChart3, title: "Data-Driven", description: "Evidence-based approach using bloodwork and biofeedback" },
  { icon: Heart, title: "Sustainable", description: "Lifestyle integration for long-term results, not quick fixes" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-32 px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: "linear-gradient(135deg, var(--orb-1), var(--orb-2))" }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: "linear-gradient(135deg, var(--orb-2), var(--orb-3))" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass backdrop-blur-xl text-indigo-600 dark:text-indigo-300 text-xs font-medium uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Transformative Services
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Health & Lifestyle</span> Blueprint
          </h2>
          <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-3xl mx-auto">
            As a certified health & lifestyle consultant, I provide comprehensive solutions that address nutrition, fitness, and mindset for holistic transformation.
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, delay: i * 0.1 }}
            >
              <GlassCard className="h-full hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6`}>
                  <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 dark:text-neutral-400 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500/50" />
                      <span className="text-sm text-slate-700 dark:text-neutral-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-8 h-1 w-full rounded-full bg-gradient-to-r ${service.color}`} />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-indigo-600 dark:text-indigo-400">NutriCepss</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A holistic approach that goes beyond counting calories and lifting weights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, delay: 0.3 + i * 0.1 }}
            >
              <GlassCard className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                <p className="text-slate-600 dark:text-neutral-400">{benefit.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.6 }}
          className="text-center mt-24"
        >
          <GlassCard className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-white/50 to-white/20 dark:from-black/50 dark:to-black/20">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Health & Lifestyle?
            </h3>
            <p className="text-lg text-slate-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Book a discovery call to discuss your goals and see if we're the right fit.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all"
            >
              Book Discovery Call
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}