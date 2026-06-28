import { useDraggable } from '@dnd-kit/core';
import type { ElementType } from '../types';

interface SidebarItemProps {
  type: ElementType;
  label: string;
}

function SidebarItem({ type, label }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type,
      isSidebarItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        backgroundColor: '#f9fafb',
        border: '1px solid #dddddd',
        borderRadius: '4px',
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        borderColor: isDragging ? '#2563eb' : '#dddddd',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#333333' }}>
        {label}
      </span>
      <span style={{ fontSize: '14px', color: '#999999' }}>☰</span>
    </div>
  );
}

export default function Sidebar() {
  const elements: { type: ElementType; label: string }[] = [
    { type: 'h', label: 'Heading' },
    { type: 'p', label: 'Paragraph' },
    { type: 'input', label: 'Input Field' },
    { type: 'button', label: 'Button' },
    { type: 'image', label: 'Image' },
  ];

  return (
    <aside style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: '5px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#111111' }}>Elements Menu</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {elements.map((el) => (
          <SidebarItem key={el.type} type={el.type} label={el.label} />
        ))}
      </div>
    </aside>
  );
}
