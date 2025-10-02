import { Card } from "@/components/ui/card";

interface Component {
  id: string;
  type: string;
  label: string;
  description: string;
}

const components: Component[] = [
  { id: 'hero', type: 'hero', label: 'Hero Section', description: 'Title + subtitle + CTA' },
  { id: 'navbar-comp', type: 'navbar-component', label: 'Navigation Bar', description: 'Responsive navbar' },
  { id: 'features', type: 'features', label: 'Feature Cards', description: 'Grid of feature cards' },
  { id: 'testimonials', type: 'testimonials', label: 'Testimonial Slider', description: 'Customer testimonials' },
  { id: 'footer-comp', type: 'footer-component', label: 'Footer', description: 'Multi-column footer' },
  { id: 'cta', type: 'cta', label: 'Call-to-Action', description: 'Bold CTA section' },
  { id: 'content-grid', type: 'content-grid', label: 'Content Grid', description: 'Dynamic content grid' },
];

export function ComponentLibrary() {
  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('componentType', component.type);
    e.dataTransfer.setData('componentLabel', component.label);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1">
        Premade Components
      </h3>
      {components.map((component) => (
        <Card
          key={component.id}
          className="p-4 cursor-move hover:bg-accent hover:border-primary/50 transition-all"
          draggable
          onDragStart={(e) => handleDragStart(e, component)}
        >
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">{component.label}</h4>
            <p className="text-xs text-muted-foreground">{component.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
