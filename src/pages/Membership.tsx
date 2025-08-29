import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { Sitemap } from "@/components/sitemap";
import { Navigation } from "@/components/ui/navigation";

const membershipPlans = [
  {
    name: "Individual",
    price: 45,
    yearlyPrice: 450,
    popular: false,
    description: "Perfect for individual players",
    features: [
      "Access to all club facilities",
      "Monthly newsletter",
      "Tournament entry discounts",
      "Equipment rental discounts",
      "Basic training resources",
    ],
  },
  {
    name: "Family",
    price: 80,
    yearlyPrice: 800,
    popular: true,
    description: "Great for families and couples",
    features: [
      "Up to 4 family members",
      "All Individual benefits",
      "Priority event booking",
      "Free guest passes (2/month)",
      "Family tournament categories",
      "Youth program discounts",
    ],
  },
  {
    name: "Club",
    price: 200,
    yearlyPrice: 2000,
    popular: false,
    description: "For clubs and organizations",
    features: [
      "Covers entire club membership",
      "Bulk equipment discounts",
      "Event hosting support",
      "Coaching resource access",
      "Tournament organization tools",
      "Annual club support grant",
    ],
  },
];

export default function Membership() {
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
              Join Our Community
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Become a Member
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join Saskatchewan's premier table tennis community. Choose the membership 
              that fits your needs and start your journey to table tennis excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <div className="bg-muted p-1 rounded-2xl inline-flex">
              <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all">
                Monthly
              </button>
              <button className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground font-medium transition-all">
                Yearly <span className="text-xs text-primary ml-1">(Save 15%)</span>
              </button>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={`p-8 h-full border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-strong' 
                    : 'border-border hover:border-primary/30 hover:shadow-medium'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                      <div className="text-sm text-muted-foreground mt-1">
                        or ${plan.yearlyPrice}/year
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    size="lg" 
                    className="w-full"
                  >
                    Choose {plan.name}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Join Table Tennis Saskatchewan?</h2>
            <p className="text-xl text-muted-foreground">
              Experience the benefits of being part of our vibrant table tennis community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Expert Coaching",
                description: "Access to certified coaches and SPED training programs",
              },
              {
                title: "Community Events",
                description: "Regular tournaments, leagues, and social events throughout the year",
              },
              {
                title: "Equipment Access",
                description: "Discounted equipment rentals and exclusive member pricing",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sitemap Section */}
      <Sitemap />
    </div>
  );
}