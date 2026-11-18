'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Loader2, LogOut, Menu, Settings } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Logo from './Logo'
import { UserAvatar } from './UserMenu'
import { NAV_LINKS, NavUser } from './Config'
import { useLogout } from './UseLogout'


const linkClass =
  'flex items-center gap-3 rounded-md px-2 py-2.5 text-[1.2rem] text-[#EADBC8] transition-colors hover:bg-[#2A1A10] hover:text-[#B9733A]'

const MobileMenu = ({ user }: { user: NavUser | null }) => {
  const [open, setOpen] = useState(false)
  const { logout, isPending } = useLogout()
  const close = () => setOpen(false)

  const handleLogout = async () => {
    close()
    await logout()
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="size-10 text-[#3B2417] hover:bg-[#EADBC8] hover:text-[#B9733A]"
            />
          }
        >
          <Menu className="size-6" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[80vw] max-w-sm flex-col gap-0 border-l-0 bg-[#3B2417] p-0 font-sans text-[#EADBC8] [&>button]:text-[#F5EDE3] [&>button]:hover:bg-[#2A1A10]"
        >
          <SheetHeader className="px-6 pb-0 pt-5 text-left">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
            <Logo tone="light" onClick={close} />
          </SheetHeader>

          {user && (
            <div className="mx-6 mt-8 flex items-center gap-3 rounded-xl bg-[#2A1A10] p-3">
              <UserAvatar user={user} className="size-11" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#F5EDE3]">{user.name}</p>
                <p className="truncate text-xs text-[#EADBC8]/70">{user.email}</p>
              </div>
            </div>
          )}

          <nav className={`flex flex-col gap-1 px-4 ${user ? 'mt-4' : 'mt-8'}`}>
            {NAV_LINKS.map((l: { href: string; label: string }) => (
              <Link key={l.href} href={l.href} onClick={close} className={linkClass}>
                {l.label}
              </Link>
            ))}

            {user && (
              <>
                <Separator className="my-2 bg-[#EADBC8]/15" />
                <Link href="/dashboard" onClick={close} className={linkClass}>
                  <LayoutDashboard className="size-5" /> Dashboard
                </Link>
                <Link href="/profile" onClick={close} className={linkClass}>
                  <Settings className="size-5" /> Profile Settings
                </Link>
              </>
            )}
          </nav>

          {user ? (
            <div className="mt-auto px-4 pb-6 pt-4">
              <Separator className="mb-3 bg-[#EADBC8]/15" />
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                disabled={isPending}
                aria-busy={isPending}
                className="h-11 w-full justify-start gap-3 rounded-full px-2.5 text-[1rem] text-[#EADBC8] hover:bg-[#2A1A10] hover:text-[#F5EDE3] disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="size-5" aria-hidden="true" />
                )}
                {isPending ? 'Signing out…' : 'Logout'}
              </Button>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-3 px-6 pb-6">
              <Link
                href="/sign-in"
                onClick={close}
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-11 rounded-full border-[#EADBC8] bg-transparent text-[1rem] text-[#EADBC8] hover:bg-[#EADBC8] hover:text-[#2A1A10]',
                })}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={close}
                className={buttonVariants({
                  className:
                    'h-11 rounded-full bg-[#B9733A] text-[1rem] text-[#F5EDE3] hover:bg-[#F5EDE3] hover:text-[#2A1A10]',
                })}
              >
                Sign Up
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileMenu
