import React from 'react'
import HeroBanner from '@/components/root/home/HeroBanner'
import AboutSection from '@/components/root/home/AboutSection'
import ExploreSection from '@/components/root/home/ExploreSection'
import WhyChooseSection from '@/components/root/home/WhyChooseSection'
import HowItWorksSection from '@/components/root/home/HowItWorksSection'
import Testimonials from '@/components/root/home/Testimonials'
import Faq from '@/components/root/home/Faq'
import CtaBanner from '@/components/root/home/CtaBanner'

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
       <AboutSection />
       <ExploreSection />
       <WhyChooseSection />
       <HowItWorksSection />
       <Testimonials />
       <Faq />
       <CtaBanner />
    </div>
  )
}

export default HomePage
