import React from 'react'
import Link from 'next/link'
import Logo from '../navbar/Logo'

const importantLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Menu', href: '/menu' },
  { label: 'Sign In', href: '/sign-in' },
  { label: 'Sign Up', href: '/sign-up' },
]

const contactInfo = [
  { label: 'Address', value: '12 Pizza Street, Dhaka 1212, Bangladesh' },
  { label: 'Phone', value: '+880 1700-000000', href: 'tel:+8801700000000' },
  { label: 'Email', value: 'hello@pizzahub.com', href: 'mailto:hello@pizzahub.com' },
]

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
} as const

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg {...iconProps}>
        <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg {...iconProps}>
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg {...iconProps}>
        <path d="M17.8 3h3l-6.5 7.5L22 21h-6l-4.7-6.1L5.9 21h-3l7-8L2 3h6.1l4.2 5.6L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg {...iconProps}>
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
      </svg>
    ),
  },
]

const headingClass =
  'font-display text-[clamp(1.15rem,1rem+0.7vw,1.4rem)] leading-none text-[#F5EDE3]'
const linkClass = 'transition-colors hover:text-[#B9733A]'

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-[#3B2417] text-[#EADBC8]">
      <div className="mx-auto w-[90vw] py-10 font-sans md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Logo + description */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <p className="max-w-xs text-[clamp(0.875rem,0.82rem+0.25vw,1rem)] leading-relaxed text-[#EADBC8]/80">
              Fresh, hand-stretched pizzas baked hot and delivered to your door.
              Order your favourite pizza online in just a few taps.
            </p>
          </div>

          {/* Important links */}
          <div className="flex flex-col gap-4">
            <h3 className={headingClass}>Important Links</h3>
            <ul className="flex flex-col gap-2.5 text-[clamp(0.875rem,0.82rem+0.25vw,1rem)]">
              {importantLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact information */}
          <div className="flex flex-col gap-4">
            <h3 className={headingClass}>Contact Us</h3>
            <ul className="flex flex-col gap-2.5 text-[clamp(0.875rem,0.82rem+0.25vw,1rem)]">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <span className="block text-xs uppercase tracking-wider text-[#B9733A]">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a href={item.href} className={linkClass}>
                      {item.value}
                    </a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social media */}
          <div className="flex flex-col gap-4">
            <h3 className={headingClass}>Follow Us</h3>
            <ul className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex size-10 items-center justify-center rounded-full border border-[#7A6455] text-[#EADBC8] transition-colors hover:border-[#B9733A] hover:bg-[#B9733A] hover:text-[#F5EDE3]"
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[#7A6455]/50 pt-6 text-center text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-[#EADBC8]/70">
          © 2026 PizzaHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer