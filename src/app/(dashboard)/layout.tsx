import React from 'react'
import Logo from '@/components/shared/navbar/Logo'
import GridRule from '@/components/home/GridRule'
import { requireUser } from '@/lib/cors/Session'

// The dashboard header shows the signed-in user, so it blocks on the session read.
export const instant = false

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Guests are redirected to /sign-in before anything renders.
  const user = await requireUser()

  return (
    <div className="flex min-h-svh flex-col bg-[#F5EDE3]">
      <header className="mx-auto flex w-[90vw] max-w-[1200px] items-center justify-between gap-4 py-5">
        <Logo />

        <div className="min-w-0 text-right font-sans">
          <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
            Signed in as
          </p>
          <p className="truncate text-[0.9375rem] text-[#3B2417]">{user.name}</p>
        </div>
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
