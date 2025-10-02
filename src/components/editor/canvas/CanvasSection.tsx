import { useState } from "react";
import { CanvasContainer } from "./CanvasContainer";
import { CanvasElement } from "./CanvasElement";

interface SectionElement {
  id: string;
  type: string;
  label: string;
  content: any;
  styles: any;
}

interface Container {
  id: string;
  elements: SectionElement[];
}

interface CanvasSectionProps {
  section: {
    id: string;
    containers: Container[];
    directElements: SectionElement[];
  };
  isSelected: boolean;
  selectedElementId: string | null;
  selectedContainerId: string | null;
  onSelect: () => void;
  onElementSelect: (element: SectionElement) => void;
  onContainerSelect: (containerId: string) => void;
  onDropInContainer: (containerId: string, elementData: any) => void;
  onDropInSection: (elementData: any) => void;
  isPreviewMode?: boolean;
}

export function CanvasSection({ 
  section, 
  isSelected,
  selectedElementId,
  selectedContainerId,
  onSelect,
  onElementSelect,
  onContainerSelect,
  onDropInContainer,
  onDropInSection,
  isPreviewMode = false
}: CanvasSectionProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    onDropInSection(e.dataTransfer);
  };

  const isEmpty = section.containers.length === 0 && section.directElements.length === 0;

  return (
    <section
      style={{
        width: '100%',
        padding: '60px 20px',
        backgroundColor: dragOver ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--background))',
        border: isPreviewMode ? 'none' : (isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))'),
        minHeight: '150px',
        transition: 'all 0.2s ease',
        cursor: isPreviewMode ? 'default' : 'pointer'
      }}
      onClick={(e) => {
        if (!isPreviewMode) {
          e.stopPropagation();
          onSelect();
        }
      }}
      onDragOver={!isPreviewMode ? handleDragOver : undefined}
      onDragLeave={!isPreviewMode ? handleDragLeave : undefined}
      onDrop={!isPreviewMode ? handleDrop : undefined}
    >
      {dragOver && !isPreviewMode && (
        <div className="border-2 border-dashed border-primary bg-primary/5 rounded-lg p-8 text-center mb-4">
          <p className="text-primary font-medium">Drop here</p>
        </div>
      )}
      
      {isEmpty && !dragOver && !isPreviewMode && (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg font-medium">📄 Section</p>
          <p className="text-sm mt-2">Drop containers or elements here</p>
        </div>
      )}
      
      <div className="space-y-6">
        {section.containers.map((container) => (
          <CanvasContainer
            key={container.id}
            container={container}
            isSelected={selectedContainerId === container.id}
            selectedElementId={selectedElementId}
            onSelect={() => onContainerSelect(container.id)}
            onElementSelect={onElementSelect}
            onDrop={(data) => onDropInContainer(container.id, data)}
            isPreviewMode={isPreviewMode}
          />
        ))}
        
        {section.directElements.map((element) => (
          <div key={element.id} className="max-w-4xl mx-auto">
            <CanvasElement
              element={element}
              isSelected={!isPreviewMode && selectedElementId === element.id}
              onSelect={() => onElementSelect(element)}
              isPreviewMode={isPreviewMode}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
