import { useState } from "react";
import { Layout } from "lucide-react";

interface CanvasElement {
  id: string;
  type: string;
  label: string;
  content: any;
  styles: any;
}

interface EditorCanvasProps {
  deviceView: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  onElementSelect: (element: CanvasElement | null) => void;
}

export function EditorCanvas({ deviceView, zoom, onElementSelect }: EditorCanvasProps) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const elementType = e.dataTransfer.getData('elementType');
    const componentType = e.dataTransfer.getData('componentType');
    const type = elementType || componentType;
    const label = e.dataTransfer.getData('elementLabel') || e.dataTransfer.getData('componentLabel');

    if (!type) return;

    const newElement: CanvasElement = {
      id: `${type}-${Date.now()}`,
      type,
      label,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };

    setElements([...elements, newElement]);
  };

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      text: { text: 'Edit me - Double click to change' },
      button: { text: 'Click Me', link: '#' },
      link: { text: 'Click here', href: '#' },
      image: { src: '', alt: 'Image placeholder' },
      icon: { name: 'star' },
      card: { title: 'Card Title', text: 'Card description goes here', buttonText: 'Learn More' },
      form: { fields: ['Name', 'Email'], submitText: 'Submit' },
      hero: { title: 'Welcome to Your Site', subtitle: 'Build something amazing', ctaText: 'Get Started' },
      navbar: { logo: 'Logo', links: ['Home', 'About', 'Contact'] },
      footer: { columns: ['Company', 'Resources', 'Legal'] }
    };
    return defaults[type] || {};
  };

  const getDefaultStyles = (type: string) => {
    const baseStyles: Record<string, any> = {
      text: { fontSize: '16px', color: '#000000', fontWeight: 'normal' },
      button: { 
        backgroundColor: '#2563eb', 
        color: '#ffffff', 
        padding: '12px 24px', 
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer'
      },
      link: { color: '#2563eb', textDecoration: 'underline', fontSize: '14px' },
      image: { width: '100%', maxWidth: '400px', height: 'auto', backgroundColor: '#e5e7eb' },
      container: { padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' },
      section: { padding: '40px 20px', backgroundColor: '#ffffff', width: '100%' },
      card: { 
        padding: '24px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      hero: { 
        padding: '80px 20px', 
        backgroundColor: '#f9fafb', 
        textAlign: 'center',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      navbar: { 
        padding: '16px 40px', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      footer: { 
        padding: '40px 20px', 
        backgroundColor: '#1f2937', 
        color: '#ffffff',
        textAlign: 'center'
      }
    };
    return baseStyles[type] || {};
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedId === element.id;
    const style = {
      ...element.styles,
      outline: isSelected ? '2px solid #2563eb' : 'none',
      position: 'relative' as const,
      minHeight: '40px',
      margin: '8px 0'
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(element.id);
      onElementSelect(element);
    };

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <p style={{ fontSize: element.styles.fontSize, color: element.styles.color }}>
              {element.content.text}
            </p>
          </div>
        );
      
      case 'button':
        return (
          <div key={element.id} onClick={handleClick} style={{ margin: '8px 0' }}>
            <button style={style}>{element.content.text}</button>
          </div>
        );
      
      case 'link':
        return (
          <div key={element.id} onClick={handleClick} style={{ margin: '8px 0' }}>
            <a href={element.content.href} style={style}>{element.content.text}</a>
          </div>
        );
      
      case 'image':
        return (
          <div key={element.id} onClick={handleClick} style={{ margin: '8px 0' }}>
            <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              {element.content.src ? (
                <img src={element.content.src} alt={element.content.alt} style={{ maxWidth: '100%' }} />
              ) : (
                <div className="text-muted-foreground">📷 Image Placeholder</div>
              )}
            </div>
          </div>
        );
      
      case 'section':
      case 'container':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <div className="text-muted-foreground text-sm">
              {element.type === 'section' ? '📦 Section' : '📦 Container'} - Drop elements here
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <h3 className="font-bold text-lg mb-2">{element.content.title}</h3>
            <p className="text-muted-foreground mb-4">{element.content.text}</p>
            <button style={getDefaultStyles('button')}>{element.content.buttonText}</button>
          </div>
        );
      
      case 'hero':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <h1 className="text-4xl font-bold text-white mb-4">{element.content.title}</h1>
            <p className="text-xl text-white/90 mb-6">{element.content.subtitle}</p>
            <button style={getDefaultStyles('button')}>{element.content.ctaText}</button>
          </div>
        );
      
      case 'navbar':
      case 'navbar-component':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <div className="font-bold text-lg">{element.content.logo}</div>
            <div className="flex gap-6">
              {element.content.links?.map((link: string, i: number) => (
                <a key={i} href="#" className="text-foreground hover:text-primary">{link}</a>
              ))}
            </div>
          </div>
        );
      
      case 'footer':
      case 'footer-component':
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {element.content.columns?.map((col: string, i: number) => (
                <div key={i}>
                  <h4 className="font-bold mb-2">{col}</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Link 1</li>
                    <li>Link 2</li>
                    <li>Link 3</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <div className="text-muted-foreground">{element.label}</div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-muted/30 overflow-auto p-8">
      <div 
        className="mx-auto bg-background shadow-xl min-h-[800px] transition-all"
        style={{ 
          width: canvasWidths[deviceView],
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          setSelectedId(null);
          onElementSelect(null);
        }}
      >
        {dragOver && (
          <div className="border-2 border-dashed border-primary bg-primary/5 rounded-lg p-8 m-4 text-center">
            <p className="text-primary font-medium">Drop element here</p>
          </div>
        )}
        
        {elements.length === 0 && !dragOver && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Drag elements here to start building</p>
              <p className="text-sm mt-2">Choose from Elements or Components on the left</p>
            </div>
          </div>
        )}

        {elements.map(renderElement)}
      </div>
    </div>
  );
}
