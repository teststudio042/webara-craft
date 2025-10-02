import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span>Webara</span>
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/templates" className="text-sm font-medium hover:text-primary transition-colors">
              Templates
            </Link>
            <Link to="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
