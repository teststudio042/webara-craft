import { Palette, Smartphone, Zap, Code, Layout, CloudUpload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Layout,
    title: "Drag & Drop Builder",
    description: "Intuitive visual editor with snap-to-grid alignment. Build layouts effortlessly with sections, containers, and elements.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description: "Design once, work everywhere. Customize styles for desktop, tablet, and mobile with independent breakpoint controls.",
  },
  {
    icon: Palette,
    title: "Unlimited Customization",
    description: "Complete control over fonts, colors, spacing, borders, shadows, and animations. Make it truly yours.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance and instant preview. See changes in real-time as you build your perfect website.",
  },
  {
    icon: Code,
    title: "Export Clean Code",
    description: "Export production-ready HTML, CSS, and JavaScript. Own your code and host anywhere you want.",
  },
  {
    icon: CloudUpload,
    title: "Instant Publishing",
    description: "One-click publish to the web. Share your creation with the world in seconds with custom domains.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Build Amazing Websites
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features that make website building simple, fast, and enjoyable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
