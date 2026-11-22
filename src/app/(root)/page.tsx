import React from "react";
import HeroBanner from "@/components/root/home/HeroBanner";
import AboutSection from "@/components/root/home/AboutSection";
import ExploreSection from "@/components/root/home/ExploreSection";
import CategoriesSection from "@/components/root/home/CategoriesSection";
import WhyChooseSection from "@/components/root/home/WhyChooseSection";
import HowItWorksSection from "@/components/root/home/HowItWorksSection";
import Testimonials from "@/components/root/home/Testimonials";
import Faq from "@/components/root/home/Faq";
import CtaBanner from "@/components/root/home/CtaBanner";
import Reveal from "@/components/shared/Reveal";

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
      <Reveal><AboutSection /></Reveal>
      <Reveal><ExploreSection /></Reveal>
      <Reveal><CategoriesSection /></Reveal>
      <Reveal><WhyChooseSection /></Reveal>
      <Reveal><HowItWorksSection /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><Faq /></Reveal>
      <Reveal><CtaBanner /></Reveal>
    </div>
  );
};

export default HomePage;