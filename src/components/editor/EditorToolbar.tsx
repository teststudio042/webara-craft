import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Undo, 
  Redo, 
  Eye, 
  Upload, 
  Monitor, 
  Tablet, 
  Smartphone,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditorToolbarProps {
  projectName: string;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function EditorToolbar({ 
  projectName, 
  deviceView, 
  onDeviceChange,
  zoom,
  onZoomChange 
}: EditorToolbarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-bold text-primary text-lg">Webara</span>
        </Button>
        <div className="h-6 w-px bg-border" />
        <span className="font-semibold text-foreground">{projectName}</span>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Undo className="w-4 h-4" />
          Undo
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Redo className="w-4 h-4" />
          Redo
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Publish
        </Button>
      </div>

      {/* Right: Device View + Zoom */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={deviceView === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onDeviceChange('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceView === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onDeviceChange('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceView === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onDeviceChange('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-2 min-w-[50px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onZoomChange(Math.min(200, zoom + 25))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
