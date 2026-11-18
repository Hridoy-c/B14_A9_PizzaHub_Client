import React from 'react'
import HeroBanner from '@/components/home/HeroBanner'
import AboutSection from '@/components/home/AboutSection'
import ExploreSection from '@/components/home/ExploreSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
       <AboutSection />
       <ExploreSection />
       <WhyChooseSection />
       <HowItWorksSection />
    </div>
  )
}

export default HomePage
