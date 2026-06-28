import type { ElementConfig, ElementStyle } from '../types';

interface ConfigPanelProps {
  element: ElementConfig | null;
  onUpdateElement: (id: string, updatedFields: Partial<ElementConfig>) => void;
}

export default function ConfigPanel({ element, onUpdateElement }: ConfigPanelProps) {
  if (!element) {
    return (
      <aside className="config-panel empty">
        <div className="empty-panel-message">
          <h3>Properties</h3>
          <p>Select an element on the canvas to edit its properties.</p>
        </div>
      </aside>
    );
  }

  const handleStyleChange = (key: keyof ElementStyle, value: string | undefined) => {
    onUpdateElement(element.id, {
      style: {
        ...element.style,
        [key]: value === '' ? undefined : value,
      },
    });
  };

  const handleContentChange = (key: string, value: string) => {
    onUpdateElement(element.id, {
      [key]: value,
    });
  };

  return (
    <aside className="config-panel">
      <div className="panel-header">
        <h3>Edit {element.type === 'h' ? 'Heading' : element.type.toUpperCase()}</h3>
      </div>

      <div className="config-content scrollable">
        <div className="config-section">
          <h4>Content Settings</h4>
          
          {(element.type === 'h' || element.type === 'p' || element.type === 'button') && (
            <div className="form-group">
              <label>Text Content</label>
              {element.type === 'p' ? (
                <textarea
                  value={element.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  placeholder="Enter text..."
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={element.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  placeholder="Enter text..."
                />
              )}
            </div>
          )}

          {element.type === 'input' && (
            <>
              <div className="form-group">
                <label>Placeholder Text</label>
                <input
                  type="text"
                  value={element.placeholder || ''}
                  onChange={(e) => handleContentChange('placeholder', e.target.value)}
                  placeholder="Enter placeholder..."
                />
              </div>
              <div className="form-group">
                <label>Input Type</label>
                <select
                  value={element.inputType || 'text'}
                  onChange={(e) => handleContentChange('inputType', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                </select>
              </div>
            </>
          )}

          {element.type === 'image' && (
            <>
              <div className="form-group">
                <label>Image Source URL</label>
                <input
                  type="text"
                  value={element.src || ''}
                  onChange={(e) => handleContentChange('src', e.target.value)}
                  placeholder="Image URL..."
                />
              </div>
              <div className="form-group">
                <label>Alt Text</label>
                <input
                  type="text"
                  value={element.alt || ''}
                  onChange={(e) => handleContentChange('alt', e.target.value)}
                  placeholder="Alt text..."
                />
              </div>
            </>
          )}
        </div>

        <div className="config-section" style={{ marginTop: '20px', borderTop: '1px solid #cccccc', paddingTop: '20px' }}>
          <h4>Styles</h4>

          <div className="form-grid">
            <div className="form-group">
              <label>Font Size (px)</label>
              <input
                type="number"
                value={element.style.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                placeholder="16"
              />
            </div>
            <div className="form-group">
              <label>Text Align</label>
              <select
                value={element.style.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value as any)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={element.style.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Bg Color</label>
              <input
                type="color"
                value={element.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
