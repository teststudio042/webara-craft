import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Upload } from "lucide-react";
import { useState } from "react";

interface NavbarEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
}

export function NavbarEditor({ element, onUpdate }: NavbarEditorProps) {
  const [logoType, setLogoType] = useState<'text' | 'image'>(
    element.content.logo?.type || 'text'
  );

  const handleLogoChange = (type: 'text' | 'image', value: string) => {
    setLogoType(type);
    onUpdate({
      ...element,
      content: {
        ...element.content,
        logo: { type, value }
      }
    });
  };

  const handleLinksChange = (links: any[]) => {
    onUpdate({
      ...element,
      content: {
        ...element.content,
        links
      }
    });
  };

  const handleButtonsChange = (buttons: any[]) => {
    onUpdate({
      ...element,
      content: {
        ...element.content,
        buttons
      }
    });
  };

  const addLink = () => {
    const links = element.content.links || [];
    handleLinksChange([...links, { text: 'New Link', url: '#' }]);
  };

  const removeLink = (index: number) => {
    const links = [...element.content.links];
    links.splice(index, 1);
    handleLinksChange(links);
  };

  const updateLink = (index: number, field: string, value: string) => {
    const links = [...element.content.links];
    links[index] = { ...links[index], [field]: value };
    handleLinksChange(links);
  };

  const addButton = () => {
    const buttons = element.content.buttons || [];
    handleButtonsChange([...buttons, { text: 'Button', url: '#', style: 'primary' }]);
  };

  const removeButton = (index: number) => {
    const buttons = [...element.content.buttons];
    buttons.splice(index, 1);
    handleButtonsChange(buttons);
  };

  const updateButton = (index: number, field: string, value: string) => {
    const buttons = [...element.content.buttons];
    buttons[index] = { ...buttons[index], [field]: value };
    handleButtonsChange(buttons);
  };

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Logo</Label>
        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant={logoType === 'text' ? 'default' : 'outline'}
            onClick={() => setLogoType('text')}
            className="flex-1"
          >
            Text
          </Button>
          <Button
            size="sm"
            variant={logoType === 'image' ? 'default' : 'outline'}
            onClick={() => setLogoType('image')}
            className="flex-1"
          >
            Image
          </Button>
        </div>

        {logoType === 'text' ? (
          <Input
            placeholder="Logo Text"
            value={element.content.logo?.value || 'Webara'}
            onChange={(e) => handleLogoChange('text', e.target.value)}
          />
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={element.content.logo?.value || ''}
              onChange={(e) => handleLogoChange('image', e.target.value)}
            />
            <Button size="sm" variant="outline" className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Upload from Library
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Navigation Links</Label>
          <Button size="sm" variant="outline" onClick={addLink} className="h-7 gap-1">
            <Plus className="w-3 h-3" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {(element.content.links || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2 items-start p-2 border rounded-md bg-muted/30">
              <GripVertical className="w-4 h-4 text-muted-foreground mt-2 cursor-move" />
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Link Text"
                  value={link.text}
                  onChange={(e) => updateLink(index, 'text', e.target.value)}
                  className="h-8"
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="h-8"
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeLink(index)}
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Buttons</Label>
          <Button size="sm" variant="outline" onClick={addButton} className="h-7 gap-1">
            <Plus className="w-3 h-3" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {(element.content.buttons || []).map((button: any, index: number) => (
            <div key={index} className="flex gap-2 items-start p-2 border rounded-md bg-muted/30">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Button Text"
                  value={button.text}
                  onChange={(e) => updateButton(index, 'text', e.target.value)}
                  className="h-8"
                />
                <Input
                  placeholder="URL"
                  value={button.url}
                  onChange={(e) => updateButton(index, 'url', e.target.value)}
                  className="h-8"
                />
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={button.style}
                  onChange={(e) => updateButton(index, 'style', e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeButton(index)}
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
