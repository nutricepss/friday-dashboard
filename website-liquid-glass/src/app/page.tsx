"use client";

import FloatingNav from "../components/FloatingNav";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import FeatureGrid from "../components/FeatureGrid";
import TestimonialCarousel from "../components/TestimonialCarousel";
import PricingSection from "../components/PricingSection";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30">
      <FloatingNav />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeatureGrid />
        <TestimonialCarousel />
        <PricingSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
