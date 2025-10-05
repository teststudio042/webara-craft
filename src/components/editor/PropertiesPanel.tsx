import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavbarEditor } from "./NavbarEditor";

interface PropertiesPanelProps {
  selectedElement: any | null;
  onUpdateElement: (updates: any) => void;
}

export function PropertiesPanel({ selectedElement, onUpdateElement }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="text-center text-muted-foreground text-sm py-12 px-4">
        <p className="font-medium mb-2">No element selected</p>
        <p className="text-xs">Click on an element in the canvas to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-border">
        <h3 className="font-semibold text-sm">{selectedElement.label}</h3>
        <p className="text-xs text-muted-foreground mt-1">Type: {selectedElement.type}</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {selectedElement.type === 'navbar' && (
            <NavbarEditor 
              element={selectedElement}
              onUpdate={onUpdateElement}
            />
          )}

          {selectedElement.type === 'text' && (
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Input 
                defaultValue={selectedElement.content.text}
                placeholder="Enter text..."
              />
            </div>
          )}

          {selectedElement.type === 'button' && (
            <>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  defaultValue={selectedElement.content.text}
                  placeholder="Button text..."
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input 
                  defaultValue={selectedElement.content.link}
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {selectedElement.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  defaultValue={selectedElement.content.src}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input 
                  defaultValue={selectedElement.content.alt}
                  placeholder="Describe the image..."
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="design" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Background</Label>
              <Input 
                type="color"
                defaultValue={selectedElement.styles.backgroundColor || '#ffffff'}
              />
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input 
                type="color"
                defaultValue={selectedElement.styles.color || '#000000'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <Input 
              defaultValue={selectedElement.styles.fontSize || '16px'}
              placeholder="16px"
            />
          </div>

          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Input 
              defaultValue={selectedElement.styles.borderRadius || '0px'}
              placeholder="8px"
            />
          </div>

          <div className="space-y-2">
            <Label>Padding</Label>
            <Input 
              defaultValue={selectedElement.styles.padding || '0px'}
              placeholder="20px"
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input 
                defaultValue={selectedElement.styles.width || 'auto'}
                placeholder="auto"
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input 
                defaultValue={selectedElement.styles.height || 'auto'}
                placeholder="auto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Margin</Label>
            <Input 
              defaultValue={selectedElement.styles.margin || '0px'}
              placeholder="8px 0"
            />
          </div>

          <div className="space-y-2">
            <Label>Display</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>block</option>
              <option>flex</option>
              <option>inline-block</option>
              <option>grid</option>
            </select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t border-border">
        <Button variant="destructive" size="sm" className="w-full">
          Delete Element
        </Button>
      </div>
    </div>
  );
}
