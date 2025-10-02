import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  selectedElement: any | null;
}

export function Breadcrumb({ selectedElement }: BreadcrumbProps) {
  if (!selectedElement) {
    return (
      <div className="h-10 border-t border-border bg-card px-4 flex items-center text-xs text-muted-foreground">
        No element selected
      </div>
    );
  }

  return (
    <div className="h-10 border-t border-border bg-card px-4 flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Canvas</span>
      <ChevronRight className="w-3 h-3 text-muted-foreground" />
      <span className="text-foreground font-medium">{selectedElement.label}</span>
      <span className="text-muted-foreground">({selectedElement.type})</span>
    </div>
  );
}
