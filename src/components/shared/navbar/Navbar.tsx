import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import Logo from './Logo'

import MobileMenu from './MobileMenu'
import { NAV_LINKS, NavUser } from './Config'
import UserMenu from './UserMenu'
import LogoutButton from './LogoutButton'

// Pass the current user from your auth layer (server-side), or null when signed out.
const Navbar = ({ user = null }: { user?: NavUser | null }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#EADBC8] bg-[#F5EDE3]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5EDE3]/85">
      <nav className="mx-auto flex w-[92vw] max-w-7xl items-center justify-between gap-3 py-3 font-sans md:grid md:grid-cols-[1fr_auto_1fr] md:py-3.5">
        <Logo className="shrink-0 justify-self-start" />

        <ul className="hidden items-center gap-6 text-[1rem] md:flex lg:gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-[#7A6455] transition-colors hover:text-[#B9733A]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:justify-self-end md:gap-3">
          {user ? (
            <>
              <div className="hidden md:block">
                <UserMenu user={user} />
              </div>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'h-10 rounded-full border-[#3B2417] bg-transparent px-5 text-[0.9375rem] text-[#3B2417] hover:bg-[#3B2417] hover:text-[#F5EDE3]',
                })}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants({
                  className:
                    'h-10 rounded-full bg-[#B9733A] px-5 text-[0.9375rem] text-[#F5EDE3] hover:bg-[#2A1A10]',
                })}
              >
                Sign Up
              </Link>
            </div>
          )}

          <MobileMenu user={user} />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
