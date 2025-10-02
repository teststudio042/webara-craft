import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "2 projects",
      "5 pages per project",
      "Basic elements",
      "Mobile responsive",
      "1 GB storage",
      "Webara subdomain",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For professionals and freelancers",
    features: [
      "Unlimited projects",
      "Unlimited pages",
      "All elements & components",
      "Advanced animations",
      "10 GB storage",
      "Custom domain",
      "Export code",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Business",
    price: "$49",
    description: "For agencies and teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "White-label export",
      "100 GB storage",
      "Advanced integrations",
      "API access",
      "Dedicated support",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.featured 
                  ? 'border-primary shadow-2xl scale-105 z-10' 
                  : 'border-border/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup" className="block">
                  {plan.featured ? (
                    <GradientButton variant="primary" className="w-full">
                      {plan.cta}
                    </GradientButton>
                  ) : (
                    <Button variant="outline" className="w-full">
                      {plan.cta}
                    </Button>
                  )}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
