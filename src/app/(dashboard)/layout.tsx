import React from 'react'
import Logo from '@/components/shared/navbar/Logo'
import GridRule from '@/components/home/GridRule'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col bg-[#F5EDE3]">
      <header className="mx-auto flex w-[90vw] max-w-[1200px] items-center justify-between py-5">
        <Logo />
      </header>

      <GridRule className="h-10 md:h-14" />

      <main className="mx-auto w-[90vw] max-w-[1200px] flex-1 py-8 font-sans">
        {children}
      </main>

      <GridRule className="h-10 md:h-14" />
    </div>
  )
}

export default DashboardLayout
