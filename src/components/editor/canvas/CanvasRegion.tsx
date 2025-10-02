import { Plus } from "lucide-react";
import { CanvasSection } from "./CanvasSection";
import { Button } from "@/components/ui/button";

interface RegionSection {
  id: string;
  containers: Array<{
    id: string;
    elements: any[];
  }>;
  directElements: any[];
}

interface CanvasRegionProps {
  region: 'top' | 'middle' | 'bottom';
  label: string;
  sections: RegionSection[];
  selectedSectionId: string | null;
  selectedContainerId: string | null;
  selectedElementId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onContainerSelect: (containerId: string) => void;
  onElementSelect: (element: any) => void;
  onDropInContainer: (sectionId: string, containerId: string, data: any) => void;
  onDropInSection: (sectionId: string, data: any) => void;
  onAddSection: () => void;
  isPreviewMode?: boolean;
}

export function CanvasRegion({
  region,
  label,
  sections,
  selectedSectionId,
  selectedContainerId,
  selectedElementId,
  onSectionSelect,
  onContainerSelect,
  onElementSelect,
  onDropInContainer,
  onDropInSection,
  onAddSection,
  isPreviewMode = false
}: CanvasRegionProps) {
  return (
    <div className="relative">
      {/* Region Label */}
      {!isPreviewMode && (
        <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-y border-dashed border-border py-2 px-4 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {region === 'middle' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddSection}
              className="h-6 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Section
            </Button>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4 py-4">
        {sections.length === 0 && !isPreviewMode && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No sections yet</p>
            {region === 'middle' && (
              <p className="text-xs mt-1">Click "Add Section" to create one</p>
            )}
          </div>
        )}
        
        {sections.map((section) => (
          <CanvasSection
            key={section.id}
            section={section}
            isSelected={selectedSectionId === section.id}
            selectedElementId={selectedElementId}
            selectedContainerId={selectedContainerId}
            onSelect={() => onSectionSelect(section.id)}
            onElementSelect={onElementSelect}
            onContainerSelect={onContainerSelect}
            onDropInContainer={(containerId, data) => onDropInContainer(section.id, containerId, data)}
            onDropInSection={(data) => onDropInSection(section.id, data)}
            isPreviewMode={isPreviewMode}
          />
        ))}
      </div>
    </div>
  );
}
