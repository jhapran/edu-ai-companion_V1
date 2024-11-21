import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';

interface Tool {
  name: 'pen' | 'eraser' | 'text' | 'shape';
  icon: string;
}

interface WhiteboardProps {
  onSave?: (data: string) => void;
  onClear?: () => void;
  initialData?: string;
}

const tools: Tool[] = [
  { name: 'pen', icon: '✏️' },
  { name: 'eraser', icon: '🧹' },
  { name: 'text', icon: 'T' },
  { name: 'shape', icon: '⬜' }
];

const Whiteboard: React.FC<WhiteboardProps> = ({
  onSave,
  onClear,
  initialData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool['name']>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set initial canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load initial data if provided
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = initialData;
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    onClear?.();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    onSave?.(dataUrl);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b p-4 flex items-center space-x-4">
        <div className="flex space-x-2">
          {tools.map(tool => (
            <Button
              key={tool.name}
              onClick={() => setSelectedTool(tool.name)}
              variant={selectedTool === tool.name ? 'primary' : 'secondary'}
              className="w-10 h-10 p-0 flex items-center justify-center"
            >
              {tool.icon}
            </Button>
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-10 h-10 p-0 rounded cursor-pointer"
        />
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={e => setLineWidth(Number(e.target.value))}
          className="w-32"
        />
        <div className="flex-grow" />
        <Button onClick={handleClear} variant="secondary">
          Clear
        </Button>
        <Button onClick={handleSave} variant="primary">
          Save
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
