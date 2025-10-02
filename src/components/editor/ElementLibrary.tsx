import { Card } from "@/components/ui/card";
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Box,
  Layout,
  Star,
  CreditCard,
  FileText,
  Navigation,
  Frame
} from "lucide-react";

interface Element {
  id: string;
  type: string;
  label: string;
  icon: any;
  category: 'basic' | 'structure' | 'media' | 'interactive';
}

const elements: Element[] = [
  { id: 'text', type: 'text', label: 'Text', icon: Type, category: 'basic' },
  { id: 'button', type: 'button', label: 'Button', icon: Square, category: 'basic' },
  { id: 'link', type: 'link', label: 'Link', icon: LinkIcon, category: 'basic' },
  { id: 'image', type: 'image', label: 'Image', icon: ImageIcon, category: 'media' },
  { id: 'icon', type: 'icon', label: 'Icon', icon: Star, category: 'media' },
  { id: 'container', type: 'container', label: 'Container', icon: Box, category: 'structure' },
  { id: 'section', type: 'section', label: 'Section', icon: Layout, category: 'structure' },
  { id: 'card', type: 'card', label: 'Card', icon: CreditCard, category: 'interactive' },
  { id: 'form', type: 'form', label: 'Form', icon: FileText, category: 'interactive' },
  { id: 'navbar', type: 'navbar', label: 'Navbar', icon: Navigation, category: 'structure' },
  { id: 'footer', type: 'footer', label: 'Footer', icon: Frame, category: 'structure' },
];

export function ElementLibrary() {
  const handleDragStart = (e: React.DragEvent, element: Element) => {
    e.dataTransfer.setData('elementType', element.type);
    e.dataTransfer.setData('elementLabel', element.label);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const categories = [
    { id: 'basic', label: 'Basic' },
    { id: 'structure', label: 'Structure' },
    { id: 'media', label: 'Media' },
    { id: 'interactive', label: 'Interactive' }
  ];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryElements = elements.filter(el => el.category === category.id);
        
        return (
          <div key={category.id}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryElements.map((element) => (
                <Card
                  key={element.id}
                  className="p-3 cursor-move hover:bg-accent hover:border-primary/50 transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, element)}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <element.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{element.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
