import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Build beautiful websites in minutes</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
            Create Stunning Websites
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Without Code
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Webara is the easiest drag-and-drop website builder. Design, customize, and publish professional websites with zero coding knowledge.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/signup">
              <GradientButton variant="primary" className="group">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GradientButton>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="px-8 py-4 text-base">
                View Demo
              </Button>
            </Link>
          </div>
          
          {/* Hero Image */}
          <div className="relative mt-16 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img 
              src={heroImage} 
              alt="Webara website builder interface" 
              className="rounded-2xl shadow-2xl border border-border/50 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
