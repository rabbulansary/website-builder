# Website Builder

A simple drag-and-drop website builder built with React, TypeScript, and Vite. You can drag elements from the left panel onto the canvas, rearrange them, customize their styles (color, background color, text size, alignment) and content, and export the output to HTML or PDF.

## Tech Stack
* **React & TypeScript**
* **Vite** (build tool)
* **@dnd-kit** (drag and drop library)
* **html2canvas & jsPDF** (used for exporting canvas to PDF)

## Why @dnd-kit instead of custom drag-and-drop?
We chose `@dnd-kit` over writing custom drag-and-drop handlers or using the native HTML5 Drag and Drop API for a few reasons:
1. **Touch Support**: Native HTML5 Drag and Drop does not work on mobile devices. `@dnd-kit` works out of the box on both desktop and mobile devices by normalizing mouse and touch events.
2. **Accessibility**: It provides keyboard controls and screen reader attributes automatically, which are very tedious to build from scratch.
3. **Animations and Performance**: `@dnd-kit` manages animations (smooth sliding when swapping elements) using hardware-accelerated CSS transforms. This prevents laggy layout rendering.
4. **Collision Detection**: Rearranging elements in a list requires complex calculations to know where the dragged element is relative to other elements. `@dnd-kit` handles this logic natively, making sortable lists simple to implement.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
