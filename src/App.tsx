import { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';
import type { ElementConfig, ElementType } from './types';
import './App.css';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createDefaultElement = (type: ElementType): ElementConfig => {
  const id = generateId();
  switch (type) {
    case 'h':
      return {
        id,
        type,
        text: 'Heading Text',
        style: {
          fontSize: '28',
          color: '#0f172a',
          textAlign: 'center',
        },
      };
    case 'p':
      return {
        id,
        type,
        text: 'This is a paragraph element. Click to change its text.',
        style: {
          fontSize: '14',
          color: '#475569',
          textAlign: 'left',
        },
      };
    case 'input':
      return {
        id,
        type,
        placeholder: 'Enter text...',
        inputType: 'text',
        style: {
          fontSize: '14',
          color: '#0f172a',
          backgroundColor: '#ffffff',
        },
      };
    case 'button':
      return {
        id,
        type,
        text: 'Button Text',
        style: {
          fontSize: '14',
          color: '#ffffff',
          backgroundColor: '#4f46e5',
          textAlign: 'center',
        },
      };
    case 'image':
      return {
        id,
        type,
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        alt: 'Sample Image',
        style: {
          textAlign: 'center',
        },
      };
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

const DEFAULT_LAYOUT: ElementConfig[] = [
  {
    id: 'default-h',
    type: 'h',
    text: 'Welcome to My Website',
    style: {
      fontSize: '32',
      color: '#1e293b',
      textAlign: 'center',
    },
  },
  {
    id: 'default-p',
    type: 'p',
    text: 'Drag new elements from the left panel onto the canvas, then customize them by clicking on them.',
    style: {
      fontSize: '16',
      color: '#64748b',
      textAlign: 'center',
    },
  },
];

function App() {
  const [elements, setElements] = useState<ElementConfig[]>(DEFAULT_LAYOUT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id.toString();

    if (activeIdStr.startsWith('sidebar-')) {
      const type = activeIdStr.replace('sidebar-', '') as ElementType;
      const newElement = createDefaultElement(type);

      if (over.id === 'canvas') {
        setElements((prev) => [...prev, newElement]);
        setSelectedId(newElement.id);
      } else {
        const overIndex = elements.findIndex((el) => el.id === over.id);
        if (overIndex !== -1) {
          setElements((prev) => {
            const updated = [...prev];
            updated.splice(overIndex, 0, newElement);
            return updated;
          });
          setSelectedId(newElement.id);
        }
      }
    } else {
      if (active.id !== over.id) {
        setElements((prev) => {
          const oldIndex = prev.findIndex((el) => el.id === active.id);
          const newIndex = prev.findIndex((el) => el.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }
  };

  const handleSelectElement = (id: string) => {
    setSelectedId(id);
  };

  const handleDeleteElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleClearCanvas = () => {
    setElements([]);
    setSelectedId(null);
  };

  const handleUpdateElement = (id: string, updatedFields: Partial<ElementConfig>) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            ...updatedFields,
          } as ElementConfig;
        }
        return el;
      })
    );
  };

  const handleExportPDF = async () => {
    const target = document.getElementById('canvas-pdf-target');
    if (!target) return;

    setIsExporting(true);
    target.classList.add('pdf-rendering');

    const prevSelectedId = selectedId;
    setSelectedId(null);

    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width / 2;
      const imgHeight = canvas.height / 2;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save('custom-web-page.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Check console for error details.');
    } finally {
      target.classList.remove('pdf-rendering');
      setSelectedId(prevSelectedId);
      setIsExporting(false);
    }
  };

  const handleExportHTML = () => {
    const htmlContent = elements
      .map((el) => {
        const styleStr = [
          el.style.color ? `color: ${el.style.color}` : '',
          el.style.backgroundColor ? `background-color: ${el.style.backgroundColor}` : '',
          el.style.fontSize ? `font-size: ${el.style.fontSize}px` : '',
          el.style.textAlign ? `text-align: ${el.style.textAlign}` : '',
        ]
          .filter(Boolean)
          .join('; ');

        const inlineStyle = styleStr ? `style="${styleStr}"` : '';

        switch (el.type) {
          case 'h':
            return `  <h2 ${inlineStyle}>${el.text || 'Heading'}</h2>`;
          case 'p':
            return `  <p ${inlineStyle}>${el.text || 'Paragraph text...'}</p>`;
          case 'input':
            return `  <input type="${el.inputType || 'text'}" placeholder="${el.placeholder || ''}" style="width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 12px; ${styleStr}" />`;
          case 'button':
            return `  <button style="width: 100%; display: block; border: 1px solid #ccc; padding: 6px 12px; border-radius: 4px; margin-bottom: 12px; cursor: pointer; ${styleStr}">${el.text || 'Button'}</button>`;
          case 'image':
            return `  <img src="${el.src || ''}" alt="${el.alt || ''}" style="max-width: 100%; display: block; margin-bottom: 12px; ${styleStr}" />`;
          default:
            return '';
        }
      })
      .join('\n');

    const fullDocument = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 750px;
      margin: 40px auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-page.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  return (
    <div className="builder-app">
      <header className="builder-header">
        <div className="header-brand">
          <h1>Website Builder</h1>
        </div>

        <div className="header-actions">
          <button
            className="action-btn-clear"
            onClick={handleClearCanvas}
            title="Clear all components"
          >
            Reset Canvas
          </button>
          <button
            className="action-btn-export"
            onClick={handleExportPDF}
            disabled={isExporting || elements.length === 0}
            title="Download PDF"
          >
            {isExporting ? 'Exporting...' : 'Export to PDF'}
          </button>
          <button
            className="action-btn-export"
            onClick={handleExportHTML}
            disabled={isExporting || elements.length === 0}
            title="Download HTML"
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            Export to HTML
          </button>
        </div>
      </header>

      <main className="builder-main">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="sidebar-container">
            <Sidebar />
          </div>

          <div className="canvas-container">
            <Canvas
              elements={elements}
              selectedId={selectedId}
              onSelectElement={handleSelectElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>
        </DndContext>

        <div className="config-container">
          <ConfigPanel
            element={selectedElement}
            onUpdateElement={handleUpdateElement}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
