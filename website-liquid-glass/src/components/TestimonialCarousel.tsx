"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  { img: "/images/client1.jpg", quote: "Totally changed my career focus and energy levels.", name: "Arjun K.", role: "Executive" },
  { img: "/images/client2.jpg", quote: "I lost 15kg while traveling for work every week.", name: "Sarah M.", role: "Consultant" },
  { img: "/images/client3.jpg", quote: "Finally a plan that understands my biology.", name: "David R.", role: "Engineer" },
];

export default function TestimonialCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="results" className="py-32 relative">
      <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/[0.02]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="text-4xl md:text-5xl font-bold text-center mb-20"
        >
          Evidence.
        </motion.h2>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div
          ref={ref}
          className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, delay: i * 0.15 }}
              className="snap-center min-w-[85vw] md:min-w-0"
            >
              <div className="group relative h-[500px] rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5">
                <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-1 mb-3 text-amber-400">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-lg font-medium text-white mb-2">&ldquo;{t.quote}&rdquo;</p>
                    <p className="text-neutral-400 text-sm">{t.name} • {t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
