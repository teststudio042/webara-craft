import { Link } from "react-router-dom";
import { Palette } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50 py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span>Webara</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Build beautiful websites without code. Fast, intuitive, and powerful.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link to="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2025 Webara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
