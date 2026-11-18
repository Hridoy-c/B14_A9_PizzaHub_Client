'use client'

import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from './UseLogout'


const LogoutButton = ({ className = '' }: { className?: string }) => {
  const { logout, isPending } = useLogout()

  return (
    <Button
      type="button"
      variant="outline"
      onClick={logout}
      disabled={isPending}
      aria-busy={isPending}
      className={`h-9 rounded-full border-[#E3A59F] bg-transparent px-3.5 text-[0.875rem] text-[#B42318] hover:bg-red-50 hover:text-[#B42318] disabled:opacity-60 sm:px-4 ${className}`}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {isPending ? 'Signing out…' : 'Logout'}
    </Button>
  )
}

export default LogoutButton
