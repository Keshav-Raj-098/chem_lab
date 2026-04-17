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
  link: string
  subNavbarItems?: SubNavbarItem[]
}

const navbarItems: NavbarItem[] = [
  { name: "Home", link: "/" },
  {
    name: "Research", link: "/research",
    // subNavbarItems: [
    //   { name: "Research Areas", link: "/research/areas" },
    //   { name: "Research Facilities", link: "/research/facilities" },
    //   {
    //     name: "Research Projects", link: "/research/projects",
    //     subNavbarItems: [
    //       { name: "Projects Done", link: "/research/projects/done" },
    //       { name: "Sponsored Projects", link: "/research/projects/sponsored" },
    //       { name: "Future Projects", link: "/research/projects/future" },
    //     ]
    //   },
    // ]
  },
  {
    name: "People", link: "/people",
    // subNavbarItems: [
    //   { name: "Group", link: "/people/group" },
    //   { name: "Collaborators", link: "/people/collaborators" },
    // ]
  },
  {
    name: "Awards", link: "/awards",
    // subNavbarItems: [
    //   { name: "Group Leader", link: "/awards/groupLeader" },
    //   { name: "Group Members", link: "/awards/group-members" },
    // ]
  },
  { name: "Publications", link: "/publications" },
  { name: "News", link: "/news" },
  { name: "Outreach", link: "/outreach" },
]

const NavDropdown = ({ item, pathname }: { item: NavbarItem; pathname: string }) => {
  const [open, setOpen] = useState(false)

  const allLinks = item.subNavbarItems?.flatMap(sub =>
    [sub.link, ...(sub.subNavbarItems?.map(s => s.link) || [])]
  ) || []
  const isActive = allLinks.some(l => pathname.startsWith(l))

  return (
    <li
      className="nav-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="nav-dropdown-trigger" aria-expanded={open}>
        <span className={isActive ? 'active' : ''} style={{ color: isActive ? 'white' : undefined }}>
          {item.name}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.6 }} />
      </button>
      {open && (
        <div className="nav-dropdown-content" style={{ opacity: 1, pointerEvents: 'auto', transform: 'translateX(-50%) translateY(0)' }}>
          {item.subNavbarItems?.map((sub, i) => (
            <React.Fragment key={i}>
              <Link href={sub.link} className="nav-dropdown-item" onClick={() => setOpen(false)}>
                {sub.name}
              </Link>
              {sub.subNavbarItems?.map((child, j) => (
                <Link
                  key={j}
                  href={child.link}
                  className="nav-dropdown-item"
                  style={{ paddingLeft: 28, fontSize: '0.8125rem' }}
                  onClick={() => setOpen(false)}
                >
                  {child.name}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </li>
  )
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          Chem Lab
        </Link>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {navbarItems.map((item, index) =>
            item.subNavbarItems ? (
              <NavDropdown key={index} item={item} pathname={pathname} />
            ) : (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`nav-link ${pathname === item.link ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>

        <Link href="/contact" className="nav-cta">
          Contact Us
        </Link>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar