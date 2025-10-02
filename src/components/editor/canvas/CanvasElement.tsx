interface CanvasElementProps {
  element: {
    id: string;
    type: string;
    label: string;
    content: any;
    styles: any;
  };
  isSelected: boolean;
  onSelect: () => void;
  isPreviewMode?: boolean;
}

export function CanvasElement({ element, isSelected, onSelect, isPreviewMode = false }: CanvasElementProps) {
  const baseStyle = {
    ...element.styles,
    outline: isSelected && !isPreviewMode ? '2px solid hsl(var(--primary))' : 'none',
    cursor: isPreviewMode ? 'default' : 'pointer',
    position: 'relative' as const,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation();
      onSelect();
    }
  };

  switch (element.type) {
    case 'text':
      return (
        <div style={baseStyle} onClick={handleClick}>
          <p style={{ fontSize: element.styles.fontSize, color: element.styles.color }}>
            {element.content.text}
          </p>
        </div>
      );
    
    case 'button':
      return (
        <div onClick={handleClick} style={{ display: 'inline-block' }}>
          <button style={baseStyle}>{element.content.text}</button>
        </div>
      );
    
    case 'link':
      return (
        <div onClick={handleClick} style={{ display: 'inline-block' }}>
          <a href={element.content.href} style={baseStyle} onClick={(e) => e.preventDefault()}>
            {element.content.text}
          </a>
        </div>
      );
    
    case 'image':
      return (
        <div onClick={handleClick}>
          <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            {element.content.src ? (
              <img src={element.content.src} alt={element.content.alt} style={{ maxWidth: '100%' }} />
            ) : (
              <div className="text-muted-foreground">📷 Image Placeholder</div>
            )}
          </div>
        </div>
      );
    
    case 'card':
      return (
        <div style={baseStyle} onClick={handleClick}>
          <h3 className="font-bold text-lg mb-2">{element.content.title}</h3>
          <p className="text-muted-foreground mb-4">{element.content.text}</p>
          <button style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}>
            {element.content.buttonText}
          </button>
        </div>
      );
    
    case 'icon':
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div className="text-2xl">⭐</div>
        </div>
      );
    
    default:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div className="text-muted-foreground text-sm">{element.label}</div>
        </div>
      );
  }
}
