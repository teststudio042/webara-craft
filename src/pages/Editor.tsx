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
  const [canvasData, setCanvasData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

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
      setCanvasData((data as any).canvas_data);
    } catch (error) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    }
  };

  const handleSave = async () => {
    if (!canvasData || !projectId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ 
          canvas_data: canvasData,
          updated_at: new Date().toISOString()
        })
        .eq("id", projectId);

      if (error) throw error;
      toast.success("✅ All changes saved");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("❗ Save failed — please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!canvasData || !projectId) return;
    
    setIsPublishing(true);
    try {
      // First save the current state
      await handleSave();

      // Update published status
      const publishedUrl = `${project?.name?.toLowerCase().replace(/\s+/g, '-')}.webara.app`;
      const { error } = await supabase
        .from("projects")
        .update({ 
          published: true,
          published_url: publishedUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", projectId);

      if (error) throw error;
      
      toast.success(`🎉 Website published successfully!`);
      toast.info(`Live at: ${publishedUrl}`);
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish");
    } finally {
      setIsPublishing(false);
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
        onSave={handleSave}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
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
          canvasData={canvasData}
          onCanvasDataChange={setCanvasData}
        />

        {/* Right Sidebar - Properties */}
        {!isPreviewMode && (
          <aside className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-4">
              <h2 className="font-semibold text-sm mb-4">Properties</h2>
              <PropertiesPanel
                selectedElement={selectedElement}
                onUpdateElement={(updates) => {
                  if (!selectedElement) return;
                  
                  console.log('Update element:', updates);
                  
                  // Update the element in canvasData
                  const updatedElement = {
                    ...selectedElement,
                    ...updates,
                    content: updates.content ? { ...selectedElement.content, ...updates.content } : selectedElement.content,
                    styles: updates.styles ? { ...selectedElement.styles, ...updates.styles } : selectedElement.styles,
                  };
                  
                  // Update in all regions
                  setCanvasData(prev => {
                    const newData = { ...prev };
                    
                    ['top', 'middle', 'bottom'].forEach((region) => {
                      newData[region as keyof typeof newData] = prev[region as keyof typeof prev].map(section => ({
                        ...section,
                        directElements: section.directElements.map(el => 
                          el.id === selectedElement.id ? updatedElement : el
                        ),
                        containers: section.containers.map(container => ({
                          ...container,
                          elements: container.elements.map(el =>
                            el.id === selectedElement.id ? updatedElement : el
                          )
                        }))
                      }));
                    });
                    
                    return newData;
                  });
                  
                  // Update selected element state
                  setSelectedElement(updatedElement);
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
