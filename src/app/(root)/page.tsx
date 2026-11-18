import React from 'react'
import HeroBanner from '@/components/home/HeroBanner'
import AboutSection from '@/components/home/AboutSection'
import ExploreSection from '@/components/home/ExploreSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import Testimonials from '@/components/home/Testimonials'
import Faq from '@/components/home/Faq'
import CtaBanner from '@/components/home/CtaBanner'

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
