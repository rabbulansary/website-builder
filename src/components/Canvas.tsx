import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ElementConfig } from '../types';
import SortableItem from './SortableItem';

interface CanvasProps {
  elements: ElementConfig[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string, e: React.MouseEvent) => void;
}

export default function Canvas({
  elements,
  selectedId,
  onSelectElement,
  onDeleteElement,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%', maxWidth: '750px' }}>
        <div
          ref={setNodeRef}
          id="canvas-pdf-target"
          style={{
            minHeight: '500px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            backgroundColor: isOver ? '#eff6ff' : '#ffffff',
          }}
        >
          {elements.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '60px 10px',
              color: '#777777',
              border: '2px dashed #cccccc',
              borderRadius: '4px',
              margin: '10px',
            }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Web Canvas</h3>
              <p style={{ margin: 0, fontSize: '12px' }}>Drag elements here from the left sidebar to start building.</p>
            </div>
          ) : (
            <SortableContext
              items={elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {elements.map((el) => (
                  <SortableItem
                    key={el.id}
                    element={el}
                    isSelected={selectedId === el.id}
                    onSelect={() => onSelectElement(el.id)}
                    onDelete={onDeleteElement}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}
