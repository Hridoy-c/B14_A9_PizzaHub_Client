import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#EADBC8] bg-[#F5EDE3]">
      <nav className="mx-auto flex w-[90vw] items-center justify-between py-2.5 font-sans md:py-3">
        <Logo />

        <ul className="hidden items-center gap-5 text-[0.9375rem] md:flex lg:gap-7">
          <li>
            <Link href="/" className="text-[#7A6455] transition-colors hover:text-[#B9733A]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/menu" className="text-[#7A6455] transition-colors hover:text-[#B9733A]">
              Browse Menu
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-2.5 text-[0.875rem] md:flex">
          <Link
            href="/sign-in"
            className="rounded-full border border-[#3B2417] px-4 py-1.5 text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[#B9733A] px-4 py-1.5 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
          >
            Sign Up
          </Link>
        </div>

        <MobileMenu />
      </nav>
    </header>
  )
}

export default Navbar
