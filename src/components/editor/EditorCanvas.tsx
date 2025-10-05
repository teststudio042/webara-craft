import { useState, useEffect } from "react";
import { CanvasRegion } from "./canvas/CanvasRegion";

interface CanvasElement {
  id: string;
  type: string;
  label: string;
  content: any;
  styles: any;
}

interface Container {
  id: string;
  elements: CanvasElement[];
}

interface Section {
  id: string;
  containers: Container[];
  directElements: CanvasElement[];
}

interface CanvasData {
  top: Section[];
  middle: Section[];
  bottom: Section[];
}

interface EditorCanvasProps {
  deviceView: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  onElementSelect: (element: CanvasElement | null) => void;
  isPreviewMode?: boolean;
  canvasData?: CanvasData | null;
  onCanvasDataChange?: (data: CanvasData) => void;
}

export function EditorCanvas({ 
  deviceView, 
  zoom, 
  onElementSelect, 
  isPreviewMode = false,
  canvasData: externalCanvasData,
  onCanvasDataChange
}: EditorCanvasProps) {
  const [canvasData, setCanvasData] = useState<CanvasData>(() => 
    externalCanvasData || {
      top: [{ id: 'section-top', containers: [], directElements: [] }],
      middle: [],
      bottom: [{ id: 'section-bottom', containers: [], directElements: [] }]
    }
  );

  // Sync with external canvasData
  useEffect(() => {
    if (externalCanvasData) {
      setCanvasData(externalCanvasData);
    }
  }, [externalCanvasData]);

  // Notify parent of changes
  useEffect(() => {
    if (onCanvasDataChange) {
      onCanvasDataChange(canvasData);
    }
  }, [canvasData]);
  
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const canvasWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
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
      navbar: { 
        logo: { type: 'text', value: 'Webara' }, 
        links: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' },
          { text: 'Contact', url: '#' }
        ], 
        buttons: [
          { text: 'Sign Up', url: '#', style: 'primary' }
        ]
      },
      footer: { 
        columns: [
          { title: 'Company', links: ['About', 'Blog', 'Careers'] },
          { title: 'Product', links: ['Features', 'Pricing', 'Docs'] },
          { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] }
        ],
        socials: ['Twitter', 'GitHub', 'LinkedIn']
      },
    };
    return defaults[type] || {};
  };

  const getDefaultStyles = (type: string) => {
    const baseStyles: Record<string, any> = {
      text: { fontSize: '16px', color: 'hsl(var(--foreground))', fontWeight: 'normal' },
      button: { 
        backgroundColor: 'hsl(var(--primary))', 
        color: 'hsl(var(--primary-foreground))', 
        padding: '12px 24px', 
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer'
      },
      link: { color: 'hsl(var(--primary))', textDecoration: 'underline', fontSize: '14px' },
      image: { width: '100%', maxWidth: '400px', height: 'auto', backgroundColor: 'hsl(var(--muted))' },
      card: { 
        padding: '24px', 
        backgroundColor: 'hsl(var(--card))', 
        border: '1px solid hsl(var(--border))', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px hsl(var(--foreground) / 0.1)'
      },
      navbar: {
        padding: '16px 24px',
        backgroundColor: 'hsl(var(--card))',
        borderBottom: '1px solid hsl(var(--border))'
      },
      footer: {
        padding: '40px 24px',
        backgroundColor: 'hsl(var(--muted))',
        borderTop: '1px solid hsl(var(--border))'
      }
    };
    return baseStyles[type] || {};
  };

  const createNewElement = (type: string, label: string): CanvasElement => {
    return {
      id: `${type}-${Date.now()}`,
      type,
      label,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
  };

  const handleAddSection = (region: 'top' | 'middle' | 'bottom') => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      containers: [],
      directElements: []
    };

    setCanvasData(prev => ({
      ...prev,
      [region]: [...prev[region], newSection]
    }));
  };

  const handleDropInContainer = (sectionId: string, containerId: string, data: DataTransfer) => {
    const elementType = data.getData('elementType') || data.getData('componentType');
    const label = data.getData('elementLabel') || data.getData('componentLabel');
    
    if (!elementType) return;

    const newElement = createNewElement(elementType, label);

    let targetRegion: 'top' | 'middle' | 'bottom' | null = null;
    for (const region of ['top', 'middle', 'bottom'] as const) {
      if (canvasData[region].some(s => s.id === sectionId)) {
        targetRegion = region;
        break;
      }
    }

    if (!targetRegion) return;

    setCanvasData(prev => ({
      ...prev,
      [targetRegion]: prev[targetRegion].map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            containers: section.containers.map(container => {
              if (container.id === containerId) {
                return {
                  ...container,
                  elements: [...container.elements, newElement]
                };
              }
              return container;
            })
          };
        }
        return section;
      })
    }));

    setSelectedElementId(newElement.id);
    onElementSelect(newElement);
  };

  const handleDropInSection = (sectionId: string, data: DataTransfer) => {
    const elementType = data.getData('elementType') || data.getData('componentType');
    const label = data.getData('elementLabel') || data.getData('componentLabel');
    
    if (!elementType) return;
  
    let targetRegion: 'top' | 'middle' | 'bottom' | null = null;
    for (const region of ['top', 'middle', 'bottom'] as const) {
      if (canvasData[region].some(s => s.id === sectionId)) {
        targetRegion = region;
        break;
      }
    }
  
    if (!targetRegion) return;

    // Enforce region constraints
    const isTop = targetRegion === 'top';
    const isBottom = targetRegion === 'bottom';
    if (isTop && !['navbar', 'container', 'section'].includes(elementType)) return;
    if (isBottom && !['footer', 'container', 'section'].includes(elementType)) return;
  
    if (elementType === 'container' || elementType === 'section') {
      const newContainer: Container = {
        id: `container-${Date.now()}`,
        elements: []
      };
  
      setCanvasData(prev => ({
        ...prev,
        [targetRegion!]: prev[targetRegion!].map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              containers: [...section.containers, newContainer]
            };
          }
          return section;
        })
      }));
  
      setSelectedContainerId(newContainer.id);
      onElementSelect(null);
    } else {
      const newElement = createNewElement(elementType, label);
  
      setCanvasData(prev => ({
        ...prev,
        [targetRegion!]: prev[targetRegion!].map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              directElements: [...section.directElements, newElement]
            };
          }
          return section;
        })
      }));
  
      setSelectedElementId(newElement.id);
      onElementSelect(newElement);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedContainerId(null);
    setSelectedElementId(null);
    onElementSelect(null);
  };

  const handleContainerSelect = (containerId: string) => {
    setSelectedContainerId(containerId);
    setSelectedElementId(null);
    onElementSelect(null);
  };

  const handleElementSelect = (element: CanvasElement) => {
    setSelectedElementId(element.id);
    onElementSelect(element);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') || e.dataTransfer.getData('componentType');
    const label = e.dataTransfer.getData('elementLabel') || e.dataTransfer.getData('componentLabel');
    if (!elementType) return;

    // Only auto-wrap when middle region is empty
    if (canvasData.middle.length === 0) {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        containers: [],
        directElements: []
      };

      if (elementType === 'container' || elementType === 'section') {
        const newContainer: Container = { id: `container-${Date.now()}`, elements: [] };
        newSection.containers.push(newContainer);
      } else {
        const newContainer: Container = { id: `container-${Date.now()}`, elements: [createNewElement(elementType, label)] };
        newSection.containers.push(newContainer);
      }

      setCanvasData(prev => ({ ...prev, middle: [...prev.middle, newSection] }));
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
        onClick={() => {
          if (!isPreviewMode) {
            setSelectedSectionId(null);
            setSelectedContainerId(null);
            setSelectedElementId(null);
            onElementSelect(null);
          }
        }}
        onDragOver={!isPreviewMode ? handleCanvasDragOver : undefined}
        onDrop={!isPreviewMode ? handleCanvasDrop : undefined}
      >
        <CanvasRegion
          region="top"
          label="Top (Header/Navbar)"
          sections={canvasData.top}
          selectedSectionId={selectedSectionId}
          selectedContainerId={selectedContainerId}
          selectedElementId={selectedElementId}
          onSectionSelect={handleSectionSelect}
          onContainerSelect={handleContainerSelect}
          onElementSelect={handleElementSelect}
          onDropInContainer={handleDropInContainer}
          onDropInSection={handleDropInSection}
          onAddSection={() => handleAddSection('top')}
          isPreviewMode={isPreviewMode}
        />

        <CanvasRegion
          region="middle"
          label="Content"
          sections={canvasData.middle}
          selectedSectionId={selectedSectionId}
          selectedContainerId={selectedContainerId}
          selectedElementId={selectedElementId}
          onSectionSelect={handleSectionSelect}
          onContainerSelect={handleContainerSelect}
          onElementSelect={handleElementSelect}
          onDropInContainer={handleDropInContainer}
          onDropInSection={handleDropInSection}
          onAddSection={() => handleAddSection('middle')}
          isPreviewMode={isPreviewMode}
        />

        <CanvasRegion
          region="bottom"
          label="Bottom (Footer)"
          sections={canvasData.bottom}
          selectedSectionId={selectedSectionId}
          selectedContainerId={selectedContainerId}
          selectedElementId={selectedElementId}
          onSectionSelect={handleSectionSelect}
          onContainerSelect={handleContainerSelect}
          onElementSelect={handleElementSelect}
          onDropInContainer={handleDropInContainer}
          onDropInSection={handleDropInSection}
          onAddSection={() => handleAddSection('bottom')}
          isPreviewMode={isPreviewMode}
        />
      </div>
    </div>
  );
}
