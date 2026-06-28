import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ElementConfig } from '../types';

interface SortableItemProps {
  element: ElementConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function SortableItem({
  element,
  isSelected,
  onSelect,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const wrapperStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    margin: '2px 0',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: isSelected ? '1px solid #2563eb' : '1px solid transparent',
    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
  };

  const elementStyle: React.CSSProperties = {
    color: element.style.color || '#000000',
    backgroundColor: element.style.backgroundColor || 'transparent',
    fontSize: element.style.fontSize ? `${element.style.fontSize}px` : undefined,
    textAlign: element.style.textAlign || 'left',
  };

  const renderInnerElement = () => {
    switch (element.type) {
      case 'h':
        return (
          <h2 style={{ ...elementStyle, margin: 0 }} className="canvas-heading">
            {element.text || 'Heading'}
          </h2>
        );
      case 'p':
        return (
          <p style={{ ...elementStyle, margin: 0 }} className="canvas-paragraph">
            {element.text || 'Paragraph text...'}
          </p>
        );
      case 'input':
        return (
          <input
            type={element.inputType || 'text'}
            placeholder={element.placeholder || 'Enter text...'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              ...elementStyle,
            }}
            className="canvas-input"
            readOnly
          />
        );
      case 'button':
        return (
          <button
            style={{
              cursor: 'default',
              width: '100%',
              display: 'block',
              ...elementStyle,
            }}
            className="canvas-button"
          >
            {element.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <img
            src={element.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
            alt={element.alt || 'Image'}
            style={{
              maxWidth: '100%',
              display: 'block',
              ...elementStyle,
            }}
            className="canvas-image"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={wrapperStyle}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`canvas-item-wrapper ${isSelected ? 'is-selected' : ''}`}
    >
      <div className="canvas-item-actions">
        <span className="element-badge">{element.type.toUpperCase()}</span>
        <div className="action-buttons-group">
          <button
            onClick={(e) => onDelete(element.id, e)}
            className="text-action-btn danger"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="canvas-item-render-container" style={{ width: '100%' }}>
        {renderInnerElement()}
      </div>
    </div>
  );
}
