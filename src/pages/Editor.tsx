import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Square, 
  Code, 
  Eye, 
  Save, 
  Settings,
  ChevronLeft,
  PanelLeftClose,
  PanelRightClose
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

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

  const elements = [
    { icon: Type, label: "Text", type: "text" },
    { icon: Image, label: "Image", type: "image" },
    { icon: Square, label: "Button", type: "button" },
    { icon: Layout, label: "Container", type: "container" },
    { icon: Square, label: "Section", type: "section" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background dark">
      {/* Top Toolbar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <span className="font-semibold">{project?.name || "Loading..."}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="default" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Code className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Elements */}
        {leftSidebarOpen && (
          <aside className="w-64 border-r border-border bg-card p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">Elements</h2>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setLeftSidebarOpen(false)}
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {elements.map((element) => (
                <Card
                  key={element.type}
                  className="p-3 cursor-move hover:bg-accent transition-colors"
                  draggable
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <element.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{element.label}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3">COMPONENTS</h3>
              <div className="space-y-2">
                <Card className="p-3 cursor-move hover:bg-accent transition-colors">
                  <span className="text-sm">Navigation Bar</span>
                </Card>
                <Card className="p-3 cursor-move hover:bg-accent transition-colors">
                  <span className="text-sm">Hero Section</span>
                </Card>
                <Card className="p-3 cursor-move hover:bg-accent transition-colors">
                  <span className="text-sm">Footer</span>
                </Card>
              </div>
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 bg-muted/30 overflow-auto relative">
          {!leftSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-10"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <PanelLeftClose className="w-4 h-4 rotate-180" />
            </Button>
          )}

          <div className="min-h-full flex items-center justify-center p-8">
            <div className="w-full max-w-6xl bg-background rounded-lg shadow-2xl min-h-[800px] border border-border">
              {/* Canvas content will go here */}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Drag elements here to start building</p>
                  <p className="text-sm mt-2">Your canvas is ready!</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Properties */}
        {rightPanelOpen && (
          <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm">Properties</h2>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setRightPanelOpen(false)}
              >
                <PanelRightClose className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center text-muted-foreground text-sm py-8">
              Select an element to edit its properties
            </div>
          </aside>
        )}

        {!rightPanelOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={() => setRightPanelOpen(true)}
          >
            <PanelRightClose className="w-4 h-4 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
}
