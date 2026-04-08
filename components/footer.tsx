"use client"
import React from "react"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"
// import { Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa";
type FooterLink = {
  name: string
  link: string
}

type FooterSectionType = {
  title: string
  links?: FooterLink[]
  content?: React.ReactNode
}

const FooterSection = ({ section }: { section: FooterSectionType }) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{section.title}</h2>

      {/* Links */}
      {section.links && (
        <ul className="flex flex-col gap-2">
          {section.links.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className="transition-colors duration-150 hover:text-(--hover)"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Custom Content */}
      {section.content && <div>{section.content}</div>}
    </div>
  )
}

const Footer = () => {
  const footerSections: FooterSectionType[] = [
    {
      title: "CARBON Lab",
      content: (
        <div className="flex flex-col gap-4">
          <p className="max-w-sm">
            Please follow our social media pages for more updates.
          </p>

          <div className="flex gap-4 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-(--hover)" />
            <FaTwitter className="cursor-pointer hover:text-(--hover)" />
            <IoLogoLinkedin className="cursor-pointer hover:text-(--hover)" />
            <FaYoutube className="cursor-pointer hover:text-(--hover)" />
          </div>
        </div>
      ),
    },
    {
      title: "Links",
      links: [
        { name: "Home", link: "/" },
        { name: "Research", link: "/research/areas" },
        { name: "About", link: "/about" },
        { name: "People", link: "/people" },
        { name: "News", link: "/news" },
        { name: "Contact Us", link: "/contact" },
      ],
    },
    {
      title: "Contact Info",
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-(--hover)" />
            <span>+91-(40) 2301 6208</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-(--hover)" />
            <span>carbonlabiith@gmail.com</span>
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      content: (
        <div className="w-full h-37.5 bg-gray-300 rounded-md flex items-center justify-center text-sm">
          Map Placeholder
        </div>
      ),
    },
  ]

  return (
    <footer className="bg-primary text-primary-foreground mt-10">
      {/* Main Footer */}
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {footerSections.map((section, index) => (
          <FooterSection key={index} section={section} />
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary text-center py-4 text-lg">
        © 2026 Chemical Laboratory IIT Delhi.
      </div>
    </footer>
  )
}

export default Footer