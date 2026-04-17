import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa"
import { IoLogoLinkedin } from "react-icons/io5"

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Col 1: Brand */}
        <div>
          <div className="footer-logo">CHEM Lab</div>
          <p className="footer-tagline">Catalysis &amp; Reaction Engineering &middot; IIT Delhi</p>
          <p className="footer-desc">Please follow our social media pages for more updates.</p>
          <div className="footer-socials">
            <span className="footer-social-icon"><FaFacebook /></span>
            <span className="footer-social-icon"><FaTwitter /></span>
            <span className="footer-social-icon"><IoLogoLinkedin /></span>
            <span className="footer-social-icon"><FaYoutube /></span>
          </div>
        </div>

        {/* Col 2: Links */}
        <div>
          <h3 className="footer-col-heading">Links</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/research/areas">Research</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/people">People</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/admin/auth">Admin</Link></li>
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div>
          <h3 className="footer-col-heading">Contact</h3>
          <div className="footer-contact-item">
            <Phone className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">+91-(40) 2301 6208</span>
          </div>
          <div className="footer-contact-item">
            <Mail className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">chemlabiitd@gmail.com</span>
          </div>
          <div className="footer-contact-item">
            <MapPin className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">Dept. of Chemical Engineering, IIT Delhi</span>
          </div>
        </div>

        {/* Col 4: Location */}
        <div>
          <h3 className="footer-col-heading">Location</h3>
          <div className="footer-map-placeholder">
            IIT Delhi, Hauz Khas
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-bottom-text">&copy; 2026 Chemical Laboratory IIT Delhi. All rights reserved.</span>
          <span className="footer-bottom-text">Department of Chemical Engineering</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
