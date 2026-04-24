"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

type SubNavbarItem = {
  name: string
  link: string
  subNavbarItems?: { name: string; link: string }[]
}

type NavbarItem = {
  name: string
  link?: string
  subNavbarItems?: SubNavbarItem[]
}

const navbarItems: NavbarItem[] = [
  { name: "Home", link: "/" },
  {
    name: "Research",
    subNavbarItems: [
      { name: "Research Areas", link: "/research/areas" },
      { name: "Research Facilities", link: "/research/facilities" },
      { name: "Research Projects", link: "/research/projects" },
    ]
  },
  {
    name: "People",
    subNavbarItems: [
      { name: "Team", link: "/people/team" },
      { name: "Alumni", link: "/people/alumni" },
    ]
  },
  {
    name: "Awards",
    subNavbarItems: [
      { name: "Group Leader", link: "/awards/group-leader" },
      { name: "Group Members", link: "/awards/group-members" },
    ]
  },
  { name: "Publications", link: "/publications" },
  {
    name: "News",
    subNavbarItems: [
      { name: "Vacancies", link: "/news/vaccancy" },
      { name: "Events", link: "/news/events" },
    ]
  },
  { name: "Outreach", link: "/outreach" },
  { name: "Gallery", link: "/gallery" }
]

const NavDropdown = ({
  item,
  pathname,
  onNavigate,
  isMobile,
}: {
  item: NavbarItem
  pathname: string
  onNavigate: () => void
  isMobile: boolean
}) => {
  const [open, setOpen] = useState(false)

  const allLinks = item.subNavbarItems?.flatMap(sub =>
    [sub.link, ...(sub.subNavbarItems?.map(s => s.link) || [])]
  ) || []
  const isActive = allLinks.some(l => pathname.startsWith(l))

  // Reset open state when switching between mobile/desktop layouts.
  useEffect(() => { setOpen(false) }, [isMobile])

  return (
    <li
      className="nav-dropdown"
      onMouseEnter={isMobile ? undefined : () => setOpen(true)}
      onMouseLeave={isMobile ? undefined : () => setOpen(false)}
    >
      <button
        type="button"
        className={`nav-dropdown-trigger ${isActive ? 'active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault()
          setOpen(o => !o)
        }}
      >
        <span>{item.name}</span>
        <ChevronDown size={13} className={`nav-dropdown-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="nav-dropdown-content">
          <div className="nav-dropdown-inner">
            {item.subNavbarItems?.map((sub, i) => (
              <React.Fragment key={i}>
                <Link
                  href={sub.link}
                  className="nav-dropdown-item"
                  onClick={() => { setOpen(false); onNavigate() }}
                >
                  {sub.name}
                </Link>
                {sub.subNavbarItems?.map((child, j) => (
                  <Link
                    key={j}
                    href={child.link}
                    className="nav-dropdown-item sub-item"
                    onClick={() => { setOpen(false); onNavigate() }}
                  >
                    {child.name}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </li>
  )
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Close mobile menu when viewport grows back to desktop.
  useEffect(() => { if (!isMobile) setMobileOpen(false) }, [isMobile])

  // Close mobile menu on route change.
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={closeMobile}>
          Chemical Research Lab
        </Link>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {navbarItems.map((item, index) =>
            item.subNavbarItems ? (
              <NavDropdown
                key={index}
                item={item}
                pathname={pathname}
                onNavigate={closeMobile}
                isMobile={isMobile}
              />
            ) : (
              <li key={index}>
                <Link
                  href={item.link as string}
                  className={`nav-link ${pathname === item.link ? 'active' : ''}`}
                  onClick={closeMobile}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>

        <Link href="/contact" className="nav-cta" onClick={closeMobile}>
          Contact
        </Link>

        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
