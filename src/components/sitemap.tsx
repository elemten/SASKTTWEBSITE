import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { MapPin, Users, Calendar, Trophy, BookOpen, HelpCircle, Building2, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const sitemapSections = [
  {
    title: "Main Pages",
    icon: MapPin,
    links: [
      { label: "Home", href: "/", description: "Welcome to Table Tennis Saskatchewan" },
      { label: "Membership", href: "/membership", description: "Join our community" },
      { label: "About", href: "/about", description: "Learn about our organization" },
    ],
  },
  {
    title: "Programs & Events",
    icon: Calendar,
    links: [
      { label: "Events & Training", href: "/events", description: "All events and training programs" },
      { label: "SPED Training", href: "/events#sped", description: "Specialized training programs" },
      { label: "Youth Programs", href: "/events#youth", description: "Programs for young players" },
      { label: "Adult Leagues", href: "/events#adult", description: "Competitive adult leagues" },
      { label: "Tournaments", href: "/events#tournaments", description: "Championship events" },
    ],
  },
  {
    title: "Community",
    icon: Users,
    links: [
      { label: "Club Directory", href: "/clubs", description: "Find local clubs" },
      { label: "Community Spotlight", href: "/community", description: "Member highlights" },
      { label: "Partners", href: "/partners", description: "Our community partners" },
      { label: "Testimonials", href: "/testimonials", description: "Member experiences" },
    ],
  },
  {
    title: "Resources & Support",
    icon: BookOpen,
    links: [
      { label: "How It Works", href: "/how-it-works", description: "Getting started guide" },
      { label: "Equipment Rentals", href: "/rentals", description: "Table and equipment access" },
      { label: "Training Resources", href: "/resources", description: "Learning materials" },
      { label: "FAQ", href: "/faq", description: "Frequently asked questions" },
      { label: "Contact Us", href: "/contact", description: "Get in touch" },
    ],
  },
  {
    title: "Information",
    icon: FileText,
    links: [
      { label: "About Us", href: "/about", description: "Our organization" },
      { label: "Impact Stats", href: "/impact", description: "Community achievements" },
      { label: "News & Updates", href: "/news", description: "Latest information" },
      { label: "Privacy Policy", href: "/privacy", description: "Data protection" },
      { label: "Terms of Service", href: "/terms", description: "Usage guidelines" },
    ],
  },
];

export function Sitemap() {
  return (
    <section className="py-16 bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Site Navigation</h2>
          <p className="text-xl text-muted-foreground">
            Find everything you need to navigate our website and discover all the resources 
            available to our table tennis community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sitemapSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-primary/30">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>

                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * linkIndex }}
                      viewport={{ once: true }}
                    >
                      <NavLink
                        to={link.href}
                        className="group block p-3 rounded-lg hover:bg-primary/5 transition-all duration-200"
                      >
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                          {link.label}
                        </div>
                        <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                          {link.description}
                        </div>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Quick Access</h3>
            <p className="text-muted-foreground mb-6">
              Need help finding something specific? Use these quick links to get where you need to go.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Join Now", href: "/membership", variant: "default" },
                { label: "Find Events", href: "/events", variant: "outline" },
                { label: "Contact Support", href: "/contact", variant: "outline" },
                { label: "Club Directory", href: "/clubs", variant: "outline" },
              ].map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    link.variant === "default"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background border border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
