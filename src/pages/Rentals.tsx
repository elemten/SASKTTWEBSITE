import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableTennis, Clock, MapPin, DollarSign, Package, Check } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/ui/navigation";

const rentalItems = [
  {
    name: "Professional Table Tennis Table",
    type: "Table",
    price: 25,
    duration: "per day",
    description: "High-quality competition-grade table with net and posts",
    features: ["ITTF approved", "Portable design", "Easy setup", "Professional net"],
    image: "table"
  },
  {
    name: "Table Tennis Rackets",
    type: "Equipment",
    price: 8,
    duration: "per day",
    description: "Professional rackets with various grip styles and rubber types",
    features: ["Multiple grip sizes", "Different rubber types", "Case included", "Professional quality"],
    image: "racket"
  },
  {
    name: "Table Tennis Balls",
    type: "Equipment",
    price: 2,
    duration: "per day",
    description: "Tournament-grade 3-star balls for optimal performance",
    features: ["3-star quality", "ITTF approved", "Multiple colors", "Pack of 6"],
    image: "balls"
  },
  {
    name: "Complete Set Package",
    type: "Package",
    price: 30,
    duration: "per day",
    description: "Everything you need: table, 2 rackets, balls, and net",
    features: ["Full setup", "Best value", "Perfect for events", "Easy transport"],
    image: "package"
  }
];

const rentalLocations = [
  {
    name: "Saskatoon Table Tennis Club",
    address: "123 Sports Ave, Saskatoon, SK",
    hours: "Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-6PM",
    contact: "(306) 555-0101"
  },
  {
    name: "Regina Community Center",
    address: "456 Recreation St, Regina, SK",
    hours: "Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-7PM",
    contact: "(306) 555-0202"
  },
  {
    name: "Prince Albert Sports Complex",
    address: "789 Athletic Blvd, Prince Albert, SK",
    hours: "Mon-Fri: 7AM-11PM, Sat-Sun: 8AM-8PM",
    contact: "(306) 555-0303"
  }
];

export default function Rentals() {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20"
            >
              Equipment Rentals
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Rent Professional Equipment
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Access high-quality table tennis equipment for your events, training sessions, 
              or casual play. Professional tables, rackets, and accessories available for rent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rental Items */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Available Equipment</h2>
            <p className="text-xl text-muted-foreground">
              Choose from our selection of professional-grade table tennis equipment
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {rentalItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-8 h-full hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-primary/30">
                  <div className="flex items-start justify-between mb-4">
                    <Badge 
                      variant="secondary" 
                      className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                    >
                      {item.type}
                    </Badge>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">${item.price}</div>
                      <div className="text-sm text-muted-foreground">{item.duration}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{item.name}</h3>
                  <p className="text-muted-foreground mb-6">{item.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    Rent Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How to Rent</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get your equipment rental
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Equipment",
                description: "Browse our selection and choose the equipment you need for your event or training session."
              },
              {
                step: "2",
                title: "Book Your Rental",
                description: "Select your dates and complete the booking process. We'll confirm availability within 24 hours."
              },
              {
                step: "3",
                title: "Pickup & Return",
                description: "Collect your equipment at your chosen location and return it on the agreed date."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Locations */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Pickup Locations</h2>
            <p className="text-xl text-muted-foreground">
              Multiple convenient locations across Saskatchewan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {rentalLocations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 hover:shadow-medium transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4">{location.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                      <Package className="h-4 w-4 text-primary mt-0.5" />
                      <span>{location.contact}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Contact Location
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Ready to Rent?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get professional table tennis equipment for your next event or training session!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary">
                  Browse Equipment
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
