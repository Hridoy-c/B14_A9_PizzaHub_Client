import React from 'react'
import HeroBanner from '@/components/home/HeroBanner'
import AboutSection from '@/components/home/AboutSection'
import ExploreSection from '@/components/home/ExploreSection'

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
       <AboutSection />
       <ExploreSection />
    </div>
  )
}

export default HomePage
