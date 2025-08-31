import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Home, Users, Wrench, GraduationCap, Calendar, Camera, Phone, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const sitemapSections = [
  {
    title: "About Us",
    icon: Users,
    links: [
      { label: "History & Mission", href: "/about/history-mission", description: "Our story and mission" },
      { label: "Team Members", href: "/about/staff-board", description: "Meet our leadership team" },
      { label: "Governance", href: "/about/governance", description: "Policies and bylaws" },
      { label: "Our Story", href: "/about", description: "Learn about our organization" },
    ],
  },
  {
    title: "Services",
    icon: Wrench,
    links: [
      { label: "Membership", href: "/membership", description: "Join our community" },
      { label: "Coaching", href: "/coaching", description: "Coach education and certifications" },
      { label: "Officials", href: "/officials", description: "Umpire and referee information" },
    ],
  },
  {
    title: "Training",
    icon: GraduationCap,
    links: [
      { label: "Training Programs", href: "/play/training", description: "Skill development programs" },
      { label: "Clinics", href: "/play/clinics", description: "Workshops and skill clinics" },
      { label: "Advanced & Para", href: "/play/advanced-para", description: "High-performance pathways" },
      { label: "Where to Play", href: "/play/locations", description: "Find playing locations" },
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
              <Card className="p-6 h-full hover:shadow-medium transition-all duration-300 border border-border/50 hover:border-primary/30 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 shadow-soft">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
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
                        className="group block p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 hover:shadow-soft"
                      >
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors mb-1 text-sm">
                          {link.label}
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 leading-relaxed">
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
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Need help finding something specific? Use these quick links to get where you need to go.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Join Now", href: "/membership", variant: "default" },
                { label: "Find Events", href: "/events", variant: "outline" },
                { label: "Contact Support", href: "/contact", variant: "outline" },
                { label: "Club Directory", href: "/clubs", variant: "outline" },
              ].map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm shadow-soft hover:shadow-medium ${
                    link.variant === "default"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5"
                      : "bg-white/80 border border-border/50 hover:border-primary hover:text-primary hover:-translate-y-0.5 backdrop-blur-sm"
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
