import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { PartnerLogos } from "./partner-logos";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Membership", href: "/membership" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "History & Mission", href: "/about/history-mission" },
      { label: "Team Members", href: "/about/staff-board" },
      { label: "Governance", href: "/about/governance" },
      { label: "Our Story", href: "/about" },
    ],
  },
  {
    title: "Services & Programs",
    links: [
      { label: "Coaching", href: "/coaching" },
      { label: "Officials", href: "/officials" },
      { label: "Clubs", href: "/clubs" },
      { label: "Club Registration", href: "/clubs/register" },
      { label: "Training Programs", href: "/play/training" },
      { label: "Clinics", href: "/play/clinics" },
      { label: "Advanced & Para", href: "/play/advanced-para" },
      { label: "Where to Play", href: "/play/locations" },
    ],
  },
  {
    title: "Resources & Support",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "Resources", href: "/resources" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { 
    icon: Facebook, 
    href: "https://www.facebook.com/tabletennissask/", 
    label: "Facebook",
    color: "hover:bg-blue-600 hover:text-white"
  },
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/tabletennissaskatchewan/?hl=en", 
    label: "Instagram",
    color: "hover:bg-pink-600 hover:text-white"
  },
  { 
    icon: Mail, 
    href: "mailto:info@ttsask.ca", 
    label: "Email",
    color: "hover:bg-green-600 hover:text-white"
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-primary/30 font-sora">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden shadow-medium bg-primary/20 flex items-center justify-center border border-primary/30">
                <img src={logo} alt="Table Tennis Saskatchewan" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Table Tennis Saskatchewan
                </h3>
                <p className="text-sm text-primary font-medium">
                  Excellence in Table Tennis
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-300 mb-6 leading-relaxed"
            >
              Promoting table tennis excellence across Saskatchewan through 
              quality programs, competitive opportunities, and community engagement.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:info@ttsask.ca" 
                  className="hover:text-primary transition-colors duration-200"
                >
                  info@ttsask.ca
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:306-880-3660" 
                  className="hover:text-primary transition-colors duration-200"
                >
                  306-880-3660
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Saskatchewan, Canada</span>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="text-center mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Supported By</h4>
            <PartnerLogos size="md" showLabels={true} />
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Table Tennis Saskatchewan. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl bg-gray-800 hover:bg-primary hover:text-white transition-all duration-300 shadow-soft border border-gray-700 text-gray-300 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}