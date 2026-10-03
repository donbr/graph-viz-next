'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDemo } from '@/lib/demos'

// Mirrors the nav in donbr.github.io's Layout.tsx: white bar, blue-500 underline on the
// active link, cross-site link in blue, hamburger menu below lg
const PORTFOLIO_URL = 'https://donbr.github.io/'

type NavItem =
  | { label: string; kind: 'route'; href: string }
  | { label: string; kind: 'external'; href: string; accent?: boolean }

const navItems: NavItem[] = [
  { label: 'Demos', kind: 'route', href: '/' },
  { label: 'Projects', kind: 'external', href: `${PORTFOLIO_URL}assets/projects` },
  { label: 'Contact', kind: 'external', href: `${PORTFOLIO_URL}#contact` },
  { label: 'Main Portfolio ↗', kind: 'external', href: PORTFOLIO_URL, accent: true },
]

const navStyles = {
  desktop: {
    base: 'py-4 px-2 whitespace-nowrap hover:text-gray-900',
    active: 'text-gray-900 border-b-2 border-blue-500',
    inactive: 'text-gray-500',
  },
  mobile: {
    base: 'block py-3 px-2 rounded-md text-base hover:bg-gray-50 hover:text-gray-900',
    active: 'text-gray-900 font-semibold',
    inactive: 'text-gray-600',
  },
} as const

export default function SiteHeader() {
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Any navigation closes the menu. A pathname change resets it during render (not in an
  // effect), so returning to a page via Back/Forward never reopens it; same-path history
  // moves (hash changes) are caught by the popstate/hashchange listeners below.
  const [menu, setMenu] = useState({ open: false, pathname })
  if (menu.pathname !== pathname) setMenu({ open: false, pathname })
  const menuOpen = menu.open && menu.pathname === pathname
  const closeMenu = () => setMenu((m) => ({ ...m, open: false }))

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Return focus to the toggle only if it was inside the menu
        if (menuRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus()
        closeMenu()
      }
    }
    // Close when the viewport reaches lg, where the menu is hidden
    const desktop = window.matchMedia('(min-width: 1024px)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    desktop.addEventListener('change', handleChange)
    window.addEventListener('popstate', closeMenu)
    window.addEventListener('hashchange', closeMenu)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktop.removeEventListener('change', handleChange)
      window.removeEventListener('popstate', closeMenu)
      window.removeEventListener('hashchange', closeMenu)
    }
  }, [menuOpen])

  // "Demos" stays active on the home grid and on every demo route
  const demosActive = pathname === '/' || getDemo(pathname.split('/')[1] ?? '') !== undefined

  const renderNavLink = (item: NavItem, variant: keyof typeof navStyles) => {
    const styles = navStyles[variant]
    if (item.kind === 'route') {
      return (
        <Link
          key={item.label}
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={cn(styles.base, demosActive ? styles.active : styles.inactive)}
          onClick={closeMenu}
        >
          {item.label}
        </Link>
      )
    }
    return (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(styles.base, item.accent ? 'text-blue-600 hover:text-blue-800' : styles.inactive)}
        onClick={closeMenu}
      >
        {item.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <nav className="bg-white shadow-lg relative z-10" aria-label="Primary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 py-4 text-lg font-semibold">
            {/* Closes the menu so a back-forward-cache restore of this page doesn't show it open */}
            <a href={PORTFOLIO_URL} className="text-gray-700 hover:text-gray-900" onClick={closeMenu}>
              Don Branson
            </a>
            <span aria-hidden="true" className="text-gray-300">/</span>
            <Link href="/" className="text-gray-800 hover:text-gray-900" onClick={closeMenu}>
              Graph Demos
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item) => renderNavLink(item, 'desktop'))}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu({ open: !menuOpen, pathname })}
          >
            {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Always rendered (hidden when closed) so the button's aria-controls target exists */}
        <div id="mobile-menu" ref={menuRef} hidden={!menuOpen} className="lg:hidden border-t border-gray-200 py-2">
          {navItems.map((item) => renderNavLink(item, 'mobile'))}
        </div>
      </div>
    </nav>
  )
}
