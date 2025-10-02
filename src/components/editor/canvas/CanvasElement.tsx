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
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
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

    case 'navbar':
      return (
        <div style={{ ...baseStyle, width: '100%' }} onClick={handleClick}>
          <nav className="w-full">
            <div className="flex items-center justify-between gap-4">
              <div className="font-bold">{element.content.logo || 'Logo'}</div>
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                {(element.content.links || ['Home','About','Contact']).map((link: string) => (
                  <a key={link} href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">
                    {link}
                  </a>
                ))}
              </div>
              <button className="hidden md:inline-flex px-4 py-2 rounded-md bg-primary text-primary-foreground">
                {element.content.cta || 'Sign Up'}
              </button>
              <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border">
                <span className="sr-only">Open Menu</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </nav>
        </div>
      );

    case 'footer':
      return (
        <div style={{ ...baseStyle, width: '100%' }} onClick={handleClick}>
          <footer className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-md bg-foreground/5">
              {(element.content.columns || []).map((col: any, idx: number) => (
                <div key={idx}>
                  <h4 className="font-semibold mb-3">{col.title}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {col.links.map((l: string) => (
                      <li key={l}><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
              {(!element.content.columns || element.content.columns.length === 0) && (
                <div className="col-span-1 md:col-span-3 text-center text-muted-foreground">Footer Placeholder</div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} Webara</span>
              <div className="flex gap-3">
                {(element.content.socials || ['Twitter','GitHub']).map((s: string) => (
                  <a key={s} href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </footer>
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
