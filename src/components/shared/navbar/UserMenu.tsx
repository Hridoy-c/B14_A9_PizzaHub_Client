'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown, LayoutDashboard, Loader2, LogOut, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials, NavUser } from './Config'
import { useLogout } from './UseLogout'


export const UserAvatar = ({ user, className = 'size-8' }: { user: NavUser; className?: string }) => (
  <Avatar className={`${className} ring-2 ring-[#EADBC8]`}>
    <AvatarImage src={user.image ?? undefined} alt={user.name} />
    <AvatarFallback className="bg-[#B9733A] text-sm font-medium text-[#F5EDE3]">
      {getInitials(user.name)}
    </AvatarFallback>
  </Avatar>
)

const UserMenu = ({ user }: { user: NavUser }) => {
  const router = useRouter()
  const { logout, isPending } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="group flex items-center gap-2 rounded-full bg-[#EADBC8]/60 py-1 pl-1 pr-3 text-[0.9375rem] text-[#3B2417] outline-none transition-colors hover:bg-[#EADBC8] focus-visible:ring-2 focus-visible:ring-[#B9733A]"
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-[9rem] truncate lg:inline">{user.name}</span>
        <ChevronDown className="size-4 text-[#7A6455] transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 max-w-[calc(100vw-2rem)] border-[#EADBC8] bg-[#FFF9F0] p-1.5 text-[#3B2417]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 p-2">
            <UserAvatar user={user} className="size-10" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-xs font-normal text-[#7A6455]">{user.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer focus:bg-[#EADBC8]/70 focus:text-[#3B2417]"
          >
            <LayoutDashboard className="size-4" /> Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className="cursor-pointer focus:bg-[#EADBC8]/70 focus:text-[#3B2417]"
          >
            <Settings className="size-4" /> Profile Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#EADBC8]" />

        <DropdownMenuItem
          onClick={logout}
          disabled={isPending}
          className="cursor-pointer text-[#B42318] focus:bg-red-50 focus:text-[#B42318] data-disabled:pointer-events-none data-disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-[#B42318]" aria-hidden="true" />
          ) : (
            <LogOut className="size-4 text-[#B42318]" aria-hidden="true" />
          )}
          {isPending ? 'Signing out…' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
