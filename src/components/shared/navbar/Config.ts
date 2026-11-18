export type NavUser = {
  name: string
  email: string
  image?: string | null
}

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Browse Menu' },
] as const

export const ACCOUNT_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/profile', label: 'Profile Settings', icon: 'settings' },
] as const

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')