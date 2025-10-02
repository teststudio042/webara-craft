import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { ElementLibrary } from "@/components/editor/ElementLibrary";
import { ComponentLibrary } from "@/components/editor/ComponentLibrary";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Breadcrumb } from "@/components/editor/Breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <EditorToolbar
        projectName={project?.name || "Loading..."}
        deviceView={deviceView}
        onDeviceChange={setDeviceView}
        zoom={zoom}
        onZoomChange={setZoom}
        isPreviewMode={isPreviewMode}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
      />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Libraries */}
        {!isPreviewMode && (
          <aside className="w-72 border-r border-border bg-card overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="elements" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="elements">Elements</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <TabsContent value="elements" className="mt-0">
                  <ElementLibrary />
                </TabsContent>
                
                <TabsContent value="components" className="mt-0">
                  <ComponentLibrary />
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        )}

        {/* Canvas */}
        <EditorCanvas
          deviceView={deviceView}
          zoom={zoom}
          onElementSelect={setSelectedElement}
          isPreviewMode={isPreviewMode}
        />

        {/* Right Sidebar - Properties */}
        {!isPreviewMode && (
          <aside className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-4">
              <h2 className="font-semibold text-sm mb-4">Properties</h2>
              <PropertiesPanel
                selectedElement={selectedElement}
                onUpdateElement={(updates) => {
                  // TODO: Implement element update
                  console.log('Update element:', updates);
                }}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Bar - Breadcrumb */}
      {!isPreviewMode && <Breadcrumb selectedElement={selectedElement} />}
    </div>
  );
}
