'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

type IconButtonProps = {
  label: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}

const IconButton = ({ label, onClick, children, className = '' }: IconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-[#3B2417] transition-colors hover:bg-[#EADBC8] hover:text-[#B9733A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A] ${className}`}
    >
      {children}
    </button>
  )
}

const MobileMenu = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="md:hidden">
      <IconButton label="Open menu" onClick={() => setOpen(true)}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </IconButton>

      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-[#2A1A10]/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Right sidebar */}
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-[75vw] max-w-sm flex-col bg-[#3B2417] px-6 py-5 font-sans shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo tone="light" onClick={close} />
          <IconButton
            label="Close menu"
            onClick={close}
            className="!text-[#F5EDE3] hover:!bg-[#2A1A10]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </IconButton>
        </div>

        <nav className="mt-10 flex flex-col gap-5 text-[clamp(1.35rem,1.1rem+2vw,1.65rem)]">
          <Link href="/" onClick={close} className="text-[#EADBC8] transition-colors hover:text-[#B9733A]">
            Home
          </Link>
          <Link href="/menu" onClick={close} className="text-[#EADBC8] transition-colors hover:text-[#B9733A]">
            Browse Menu
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-3 pb-4 text-[1rem]">
          <Link
            href="/sign-in"
            onClick={close}
            className="rounded-full border border-[#EADBC8] py-2.5 text-center text-[#EADBC8] transition-colors hover:bg-[#EADBC8] hover:text-[#2A1A10]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            onClick={close}
            className="rounded-full bg-[#B9733A] py-2.5 text-center text-[#F5EDE3] transition-colors hover:bg-[#F5EDE3] hover:text-[#2A1A10]"
          >
            Sign Up
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default MobileMenu