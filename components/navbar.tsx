"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Phone, Mail, Triangle } from 'lucide-react'


type SubNavbarItem = {
  name: string,
  link: string,
  description?: string
}

type NavbarItem = {
  name: string,
  link?: string
  subNavbarItems?: SubNavbarItem[]
  description?: string
}

interface NavButtonProps {
  navbarItem: NavbarItem
  setPageTitle: (title: string) => void
}

const NavButton = ({ navbarItem, setPageTitle }: NavButtonProps) => {
  function handleClick(title?: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (title) setPageTitle(title)
    }
  }

  if (!navbarItem.subNavbarItems) {
    return (
      <li className="rounded group" key={navbarItem.name}>
        <Link
          onClick={navbarItem.description ? handleClick(navbarItem.description) : undefined}
          href={navbarItem.link || '/'}
          className="p-2 rounded transition-colors duration-150 group-hover:text-(--hover) hover:text-(--hover)"
        >
          {navbarItem.name}
        </Link>
      </li>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-row gap-1 items-center group cursor-pointer">
          <span className="transition-colors duration-150 group-hover:text-(--hover)">{navbarItem.name}</span>
          <Triangle
            size={12}
            color="currentColor"
            fill="currentColor"
            className="rotate-180 transition-colors duration-150 group-hover:text-(--hover) text-inherit"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuGroup>
          {navbarItem.subNavbarItems?.map((item, index) => (
            <DropdownMenuItem key={index}>
              <Link
                onClick={item.description ? handleClick(item.description) : undefined}
                href={item.link}
                className="transition-colors duration-150 hover:text-(--hover)"
              >
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Navbar = () => {


  const [pageTitle, setPageTitle] = useState("Chemical Research Lab, IIT Delhi")

  const navbarItems: NavbarItem[] = [
    { name: "Home", link: "/", description: "Chemical Research Lab, IIT Delhi" },
    { name: "About Us", link: "/about", description: "About Us @ Chemical Research Lab, IIT Delhi" },
    {
      name: "Research", link: "/research", subNavbarItems: [
        { name: "Research Areas", link: "/research/areas", description: "Research Areas @ Chemical Research Lab, IIT Delhi" },
        { name: "Research Facilities", link: "/research/facilities", description: "Research Facilities @ Chemical Research Lab, IIT Delhi" },
        { name: "Research Projects", link: "/research/projects", description: "Projects List @ Chemical Research Lab, IIT Delhi" }
      ]
    },
    {
      name: "People", link: "/people",
      subNavbarItems: [
        { name: "Group", link: "/people/group", description: "Group Members @ Chemical Research Lab, IIT Delhi" },
        { name: "Collaborators", link: "/people/collaborators", description: "Collaborators @ Chemical Research Lab, IIT Delhi" }
      ]
    },
    { name: "Awards", link: "/awards",description: "Awards @ Chemical Research Lab, IIT Delhi" },
    { name: "Publications", link: "/publications", description: "Publications @ Chemical Research Lab, IIT Delhi" },
    { name: "News & Announcements", link: "/news", description: "News @ Chemical Research Lab, IIT Delhi" },
    { name: "Outreach", link: "/outreach" },
    { name: "Contact Us", link: "/contact", description: "Contact Us @ Chemical Research Lab, IIT Delhi" },


  ]

  return (
    <div>
      <div className='flex flex-row justify-between items-center px-4 py-2 bg-primary text-primary-foreground'>
        <h1 className='text-2xl font-bold text-center my-4'>{pageTitle}</h1>

        <div className='flex space-x-8 text-lg'>
          <div className='flex flex-row items-center gap-2'><Phone color='var(--hover)' size={18} /> <span>+91 9897826751</span></div>
          <div className='flex flex-row items-center gap-2'><Mail color='var(--hover)' size={18} /> <span>chemlab@chemical.iitd.ac.in</span></div>
        </div>
      </div>
      <nav className='bg-secondary text-background p-4 '>
        <ul className='flex space-x-6 text-[19px]'>
          {navbarItems.map((item, index) => (
            <NavButton key={index} navbarItem={item} setPageTitle={setPageTitle} />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
