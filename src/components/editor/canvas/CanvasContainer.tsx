import { useState } from "react";
import { CanvasElement } from "./CanvasElement";

interface ContainerElement {
  id: string;
  type: string;
  label: string;
  content: any;
  styles: any;
}

interface CanvasContainerProps {
  container: {
    id: string;
    elements: ContainerElement[];
  };
  isSelected: boolean;
  selectedElementId: string | null;
  onSelect: () => void;
  onElementSelect: (element: ContainerElement) => void;
  onDrop: (elementData: any) => void;
  isPreviewMode?: boolean;
}

export function CanvasContainer({ 
  container, 
  isSelected, 
  selectedElementId,
  onSelect, 
  onElementSelect,
  onDrop,
  isPreviewMode = false
}: CanvasContainerProps) {
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
    onDrop(e.dataTransfer);
  };

  return (
    <div
      className="relative"
      style={{
        width: '80%',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: dragOver ? 'hsl(var(--primary) / 0.05)' : (isPreviewMode ? 'transparent' : 'hsl(var(--muted))'),
        border: isPreviewMode ? 'none' : (isSelected ? '2px solid hsl(var(--primary))' : '1px dashed hsl(var(--border))'),
        borderRadius: '8px',
        minHeight: isPreviewMode ? '0' : '100px',
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
        <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center z-10 pointer-events-none">
          <p className="text-primary font-medium">Drop here</p>
        </div>
      )}
      
      {container.elements.length === 0 && !dragOver && !isPreviewMode && (
        <div className="text-center text-muted-foreground text-sm py-8">
          📦 Container - Drop elements here
        </div>
      )}
      
      <div className="space-y-4">
        {container.elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={!isPreviewMode && selectedElementId === element.id}
            onSelect={() => onElementSelect(element)}
            isPreviewMode={isPreviewMode}
          />
        ))}
      </div>
    </div>
  );
}
