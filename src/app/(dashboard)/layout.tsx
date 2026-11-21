import React from 'react'
import GridRule from '@/components/root/home/GridRule'
import { requireUser } from '@/lib/cors/Session'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// The dashboard header shows the signed-in user, so it blocks on the session read.
export const instant = false

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Guests are redirected to /sign-in before anything renders.
  const user = await requireUser()

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role as string | null | undefined,
        }}
      />

      <div className="flex min-h-svh flex-1 flex-col bg-[#F5EDE3]">
        <header className="flex h-14 items-center gap-3 border-b border-[#EADBC8] px-4 font-sans sm:px-6">
          <SidebarTrigger className="-ml-1 text-[#3B2417] hover:bg-[#3B2417]/5 md:hidden" />
          <p className="truncate text-[0.875rem] text-[#7A6455]">
            Signed in as{' '}
            <span className="text-[#3B2417]">{user.name}</span>
          </p>
        </header>

        <GridRule className="h-10 md:h-14" />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 font-sans sm:px-8">
          {children}
        </main>

        <GridRule className="h-10 md:h-14" />
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout