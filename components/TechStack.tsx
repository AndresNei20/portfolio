import React, { useState, useEffect, useCallback } from "react";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiReactos,
  SiFigma,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiStorybook,
  SiGithub,
  SiFirebase,
  SiSupabase,
  SiNextdotjs,
  SiJira,
  SiFormspree,
  SiPython,
  SiFlask
} from 'react-icons/si';

type TechItem = {
  id: string;
  label: string;
  brand: { bg1: string; bg2: string; fg: string; border?: string };
  icon: React.ReactNode;
  width: number;  // 1, 2, or 3 grid units
  height: number; // 1, 2, or 3 grid units
  gridColumn?: number;
  gridRow?: number;
};

const TECH_ITEMS: TechItem[] = [
  { id: "js", label: "JavaScript", brand: { bg1: "#f7df1e", bg2: "#f0c600", fg: "#111827" }, icon: <SiJavascript />, width: 2, height: 2 },
  { id: "react", label: "React", brand: { bg1: "#61dafb", bg2: "#00bcd4", fg: "#0b1021" }, icon: <SiReact />, width: 2, height: 2 },
  { id: "next", label: "Next.js", brand: { bg1: "#111111", bg2: "#2a2a2a", fg: "#ffffff", border: "#ffffff33" }, icon: <SiNextdotjs />, width: 2, height: 2 },
  { id: "ts", label: "TypeScript", brand: { bg1: "#3178c6", bg2: "#1f6fbf", fg: "#ffffff" }, icon: <SiTypescript />, width: 2, height: 2 },
  { id: "py", label: "Python", brand: { bg1: "#3776ab", bg2: "#ffd343", fg: "#0b1021" }, icon: <SiPython />, width: 2, height: 1 },
  { id: "tail", label: "Tailwind CSS", brand: { bg1: "#38bdf8", bg2: "#06b6d4", fg: "#0b1021" }, icon: <SiTailwindcss />, width: 2, height: 1 },
  { id: "figma", label: "Figma", brand: { bg1: "#FF3737", bg2: "#874FFF", fg: "#ffffff" }, icon: <SiFigma />, width: 1, height: 2 },
  { id: "fb", label: "Firebase", brand: { bg1: "#f5820d", bg2: "#fcca3f", fg: "#0b1021" }, icon: <SiFirebase />, width: 2, height: 1 },
  { id: "sup", label: "Supabase", brand: { bg1: "#3ecf8e", bg2: "#249d6f", fg: "#0b1021" }, icon: <SiSupabase />, width: 2, height: 1 },
  { id: "gh", label: "GitHub", brand: { bg1: "#24292e", bg2: "#3b434a", fg: "#ffffff" }, icon: <SiGithub />, width: 2, height: 1 },
  { id: "agile", label: "Agile/Scrum", brand: { bg1: "#0052cc", bg2: "#2b6cb0", fg: "#ffffff" }, icon: <SiJira />, width: 1, height: 1 },
  { id: "sb", label: "Storybook", brand: { bg1: "#ff4785", bg2: "#ff71a1", fg: "#ffffff" }, icon: <SiStorybook />, width: 1, height: 1 },
  { id: "html", label: "HTML5", brand: { bg1: "#e34f26", bg2: "#ef652a", fg: "#ffffff" }, icon: <SiHtml5 />, width: 1, height: 1 },
  { id: "css", label: "CSS3", brand: { bg1: "#264de4", bg2: "#2965f1", fg: "#ffffff" }, icon: <SiCss3 />, width: 1, height: 1 },
  { id: "rn", label: "React Native", brand: { bg1: "#61dafb", bg2: "#00bcd4", fg: "#0b1021" }, icon: <SiReactos />, width: 1, height: 1 },
  { id: "flask", label: "Flask", brand: { bg1: "#0b0b0b", bg2: "#222222", fg: "#ffffff" }, icon: <SiFlask />, width: 1, height: 1 },
  { id: "form", label: "Formspree", brand: { bg1: "#ff4f57", bg2: "#ff6b72", fg: "#ffffff" }, icon: <SiFormspree />, width: 3, height: 1 },
];

const compactGrid = (itemList: TechItem[]) => {
  const GRID_COLS = 6; // Adjust based on your grid
  const grid: (string | null)[][] = [];
  const result: TechItem[] = [];

  // Initialize empty grid
  for (let row = 0; row < 20; row++) {
    grid[row] = new Array(GRID_COLS).fill(null);
  }

  // Function to check if an item can fit at a position
  const canFitAt = (item: TechItem, row: number, col: number): boolean => {
    if (col + item.width > GRID_COLS) return false;

    for (let r = row; r < row + item.height; r++) {
      for (let c = col; c < col + item.width; c++) {
        if (r >= grid.length || grid[r][c] !== null) return false;
      }
    }
    return true;
  };

  // Function to place an item on the grid
  const placeItem = (item: TechItem, row: number, col: number) => {
    for (let r = row; r < row + item.height; r++) {
      for (let c = col; c < col + item.width; c++) {
        if (r >= grid.length) {
          grid.push(new Array(GRID_COLS).fill(null));
        }
        grid[r][c] = item.id;
      }
    }
  };

  // Find first available position for each item
  for (const item of itemList) {
    let placed = false;

    for (let row = 0; row < 20 && !placed; row++) {
      for (let col = 0; col < GRID_COLS && !placed; col++) {
        if (canFitAt(item, row, col)) {
          placeItem(item, row, col);
          result.push(item);
          placed = true;
        }
      }
    }

    // If couldn't place, add to end
    if (!placed) {
      result.push(item);
    }
  }

  return result;
};

const TechStack: React.FC = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [items, setItems] = useState(TECH_ITEMS);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dropTarget, setDropTarget] = useState<{ id: string; position: 'left' | 'right' | 'top' | 'bottom' | 'center' } | null>(null);
  const [resizing, setResizing] = useState<{ id: string, direction: 'se' | 'e' | 's', startX: number, startY: number, startWidth: number, startHeight: number } | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (resizing) {
      e.preventDefault();
      return;
    }
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleResizeStart = (e: React.MouseEvent, itemId: string, direction: 'se' | 'e' | 's') => {
    e.preventDefault();
    e.stopPropagation();

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setResizing({
      id: itemId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: item.width,
      startHeight: item.height
    });
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;

    const deltaX = e.clientX - resizing.startX;
    const deltaY = e.clientY - resizing.startY;

    let newWidth = resizing.startWidth;
    let newHeight = resizing.startHeight;

    if (resizing.direction === 'se' || resizing.direction === 'e') {
      newWidth = Math.max(1, Math.min(4, resizing.startWidth + Math.round(deltaX / 80)));
    }

    if (resizing.direction === 'se' || resizing.direction === 's') {
      newHeight = Math.max(1, Math.min(3, resizing.startHeight + Math.round(deltaY / 80)));
    }

    setItems(prev =>
      prev.map(item =>
        item.id === resizing.id ? { ...item, width: newWidth, height: newHeight } : item
      )
    );
  }, [resizing]);

  // Calculate grid position for an item based on its index
  const getGridPosition = (index: number) => {
    const GRID_COLS = 6;
    let currentRow = 0;
    let currentCol = 0;

    for (let i = 0; i < index; i++) {
      const item = items[i];
      currentCol += item.width;

      if (currentCol > GRID_COLS) {
        currentRow += items[i - 1]?.height || 1;
        currentCol = item.width;
      }
    }

    return { row: currentRow, col: currentCol };
  };

  // Insert item at specific grid position
  const insertAtGridPosition = (draggedItemData: TechItem, targetPosition: { row: number, col: number }, insertType: 'before' | 'after' | 'replace') => {
    const GRID_COLS = 6;
    const newItems = items.filter(item => item.id !== draggedItemData.id);

    let insertIndex = 0;
    let currentRow = 0;
    let currentCol = 0;

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];

      // Check if we've reached the target position
      if (insertType === 'before' && currentRow >= targetPosition.row) {
        break;
      } else if (insertType === 'after' && currentRow > targetPosition.row) {
        break;
      } else if (insertType === 'replace' && currentRow >= targetPosition.row && currentCol >= targetPosition.col) {
        break;
      }

      currentCol += item.width;
      if (currentCol > GRID_COLS) {
        currentRow += item.height;
        currentCol = item.width;
      }

      insertIndex = i + 1;
    }

    newItems.splice(insertIndex, 0, draggedItemData);
    return newItems;
  };

  // Trigger compaction after any change
  // stable function, no deps
  const triggerCompaction = useCallback(() => {
    setIsAnimating(true);
    setItems(prev => compactGrid([...prev]));
    setTimeout(() => setIsAnimating(false), 600);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
    setTimeout(() => triggerCompaction(), 100);
  }, [triggerCompaction]);


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== itemId) {
      // Get the element's position and mouse position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Define drop zones as percentages
      const edgeThreshold = 0.25; // 25% from each edge

      let position: 'left' | 'right' | 'top' | 'bottom' | 'center';

      // Check edges in order of priority
      if (y < height * edgeThreshold) {
        position = 'top';
      } else if (y > height * (1 - edgeThreshold)) {
        position = 'bottom';
      } else if (x < width * edgeThreshold) {
        position = 'left';
      } else if (x > width * (1 - edgeThreshold)) {
        position = 'right';
      } else {
        position = 'center';
      }

      setDropTarget({ id: itemId, position });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetItemId || !dropTarget) {
      setDropTarget(null);
      return;
    }

    setIsAnimating(true);

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetItemId);
    const draggedItemData = items[draggedIndex];
    const targetItemData = items[targetIndex];

    let newItems: TechItem[];

    // Get target item's grid position
    const targetPosition = getGridPosition(targetIndex);

    switch (dropTarget.position) {
      case 'top':
        // Insert above the target item (start of same row or previous row)
        newItems = insertAtGridPosition(draggedItemData, { row: targetPosition.row, col: 0 }, 'before');
        break;

      case 'bottom':
        // Insert below the target item (next row)
        newItems = insertAtGridPosition(draggedItemData, { row: targetPosition.row + targetItemData.height, col: 0 }, 'before');
        break;

      case 'left':
        // Insert to the left of target item
        const leftPosition = { row: targetPosition.row, col: Math.max(0, targetPosition.col - draggedItemData.width) };
        newItems = insertAtGridPosition(draggedItemData, leftPosition, 'replace');
        break;

      case 'right':
        // Insert to the right of target item
        const rightPosition = { row: targetPosition.row, col: targetPosition.col + targetItemData.width };
        newItems = insertAtGridPosition(draggedItemData, rightPosition, 'replace');
        break;

      case 'center':
      default:
        // Replace position - simple swap
        newItems = [...items];
        const draggedItemDataCopy = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        const adjustedTargetIndex = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
        newItems.splice(adjustedTargetIndex, 0, draggedItemDataCopy);
        break;
    }

    setItems(newItems);
    setDraggedItem(null);
    setDropTarget(null);

    // Compact after positioning
    setTimeout(() => {
      setItems(prev => compactGrid([...prev]));
      setTimeout(() => setIsAnimating(false), 300);
    }, 100);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const resetLayout = () => {
    setIsAnimating(true);
    setItems(TECH_ITEMS);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Fix: Add SSR check for mouse event listeners
  useEffect(() => {
    if (resizing && typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e);
      const handleMouseUp = () => handleResizeEnd();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  return (
    <section id="techstack" className="py-20">
      <h1 className="heading mb-16">
        My Tech{" "}
        <span className="text-transparent bg-gradient-to-tr from-[#744ce1] to-white bg-clip-text">Stack</span>
      </h1>
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`tech-grid ${isAnimating ? 'animating' : ''}`}
          style={{
            background: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: "500px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`tech-item tech-item--w${item.width} tech-item--h${item.height} ${draggedItem === item.id ? 'dragging' : ''
                } ${dropTarget?.id === item.id ? `drop-target drop-target--${dropTarget.position}` : ''
                } ${draggedItem && draggedItem !== item.id ? 'potential-drop' : ''
                } ${resizing?.id === item.id ? 'resizing' : ''
                }`}
              draggable={!resizing}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              style={{
                ['--brand-bg1' as any]: item.brand.bg1,
                ['--brand-bg2' as any]: item.brand.bg2,
                ['--brand-fg' as any]: item.brand.fg,
                ['--brand-border' as any]: item.brand.border ?? "rgba(255,255,255,0.2)",
              }}
            >
              <div className="tech-card">
                <div className="content">
                  <div className="icon-wrapper">
                    {item.icon}
                  </div>
                  <span className="label">{item.label}</span>
                </div>

                {/* Resize handles */}
                <div
                  className="resize-handle resize-handle-se"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'se')}
                />
                <div
                  className="resize-handle resize-handle-e"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 'e')}
                />
                <div
                  className="resize-handle resize-handle-s"
                  onMouseDown={(e) => handleResizeStart(e, item.id, 's')}
                />

                {/* Size indicator */}
                <div className="size-indicator">
                  {item.width}×{item.height}
                </div>

                {/* Enhanced drop indicators for all positions */}
                {dropTarget?.id === item.id && (
                  <div className={`drop-indicator drop-indicator--${dropTarget.position}`}>
                    <div className="drop-arrow">
                      {dropTarget.position === 'left' ? '←' :
                        dropTarget.position === 'right' ? '→' :
                          dropTarget.position === 'top' ? '↑' :
                            dropTarget.position === 'bottom' ? '↓' : '↓'}
                    </div>
                    <span className="drop-text">
                      Drop {dropTarget.position === 'center' ? 'here' : dropTarget.position}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          auto-rows: minmax(120px, auto);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tech-grid.animating {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .tech-item {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: grab;
          position: relative;
          transform-origin: center;
        }

        .tech-grid.animating .tech-item {
          transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .tech-item:active {
          cursor: grabbing;
        }

        .tech-item.dragging {
          opacity: 0.7;
          transform: rotate(5deg) scale(1.08);
          z-index: 1000;
          transition: all 0.2s ease;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* Enhanced drop target feedback with side-specific styling */
        .tech-item.drop-target {
          transform: scale(1.05);
          border-radius: 20px;
        }

        .tech-item.drop-target .tech-card {
          border-color: rgba(203, 172, 249, 0.8);
          background: rgba(203, 172, 249, 0.1);
          box-shadow: 0 0 20px rgba(203, 172, 249, 0.3);
          transform: translateY(-2px);
        }

        /* Side-specific drop target styling */
        .tech-item.drop-target--left .tech-card {
          border-left: 4px solid rgba(203, 172, 249, 1);
        }

        .tech-item.drop-target--right .tech-card {
          border-right: 4px solid rgba(203, 172, 249, 1);
        }

        .tech-item.drop-target--top .tech-card {
          border-top: 4px solid rgba(203, 172, 249, 1);
        }

        .tech-item.drop-target--bottom .tech-card {
          border-bottom: 4px solid rgba(203, 172, 249, 1);
        }

        .tech-item.drop-target--center .tech-card {
          border: 2px solid rgba(203, 172, 249, 1);
        }

        /* Potential drop zones */
        .tech-item.potential-drop {
          opacity: 0.7;
        }

        .tech-item.potential-drop .tech-card {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        /* Enhanced drop indicators for all positions */
        .drop-indicator {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 10;
          pointer-events: none;
        }

        .drop-indicator--left {
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
        }

        .drop-indicator--right {
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
        }

        .drop-indicator--top {
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .drop-indicator--bottom {
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .drop-indicator--center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .drop-arrow {
          font-size: 24px;
          color: rgba(203, 172, 249, 0.9);
          animation: bounce 1s infinite;
          text-shadow: 0 0 10px rgba(203, 172, 249, 0.5);
        }

        .drop-text {
          font-size: 10px;
          font-weight: 600;
          color: rgba(203, 172, 249, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(0, 0, 0, 0.7);
          padding: 2px 6px;
          border-radius: 4px;
          text-shadow: 0 0 5px rgba(203, 172, 249, 0.3);
          white-space: nowrap;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        /* Independent width and height sizing */
        .tech-item--w1 { grid-column: span 1; }
        .tech-item--w2 { grid-column: span 2; }
        .tech-item--w3 { grid-column: span 3; }
        .tech-item--w4 { grid-column: span 4; }

        .tech-item--h1 { grid-row: span 1; }
        .tech-item--h2 { grid-row: span 2; }
        .tech-item--h3 { grid-row: span 3; }

        /* Enhanced resize animations for any combination */
        .tech-grid.animating .tech-item {
          animation: sizeChange 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes sizeChange {
          0% { transform: scale(1.05); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .tech-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 12px;
            auto-rows: minmax(100px, auto);
          }
          
          .tech-item--medium,
          .tech-item--large {
            grid-column: span 1;
            grid-row: span 1;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .tech-grid {
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          }
        }

        @media (min-width: 1025px) {
          .tech-grid {
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 20px;
            auto-rows: minmax(130px, auto);
          }
        }

        .tech-card {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.15);
          background: rgba(16, 19, 46, 0.8);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.3s ease, 
                      border-color 0.3s ease, 
                      background 0.3s ease;
          overflow: hidden;
          user-select: none;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
          position: relative;
          min-height: 100px;
        }

        .tech-grid.animating .tech-card {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          text-align: center;
          height: 100%;
          width: 100%;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          flex-shrink: 0;
        }

        /* Responsive icon sizing based on item dimensions */
        .tech-item--w1.tech-item--h1 .icon-wrapper { font-size: 1.5rem; }
        .tech-item--w2.tech-item--h1 .icon-wrapper { font-size: 1.8rem; }
        .tech-item--w3.tech-item--h1 .icon-wrapper { font-size: 2rem; }
        .tech-item--w4.tech-item--h1 .icon-wrapper { font-size: 2.2rem; }
        
        .tech-item--w1.tech-item--h2 .icon-wrapper { font-size: 1.8rem; }
        .tech-item--w2.tech-item--h2 .icon-wrapper { font-size: 2.5rem; }
        .tech-item--w3.tech-item--h2 .icon-wrapper { font-size: 2.8rem; }
        .tech-item--w4.tech-item--h2 .icon-wrapper { font-size: 3rem; }
        
        .tech-item--w1.tech-item--h3 .icon-wrapper { font-size: 2rem; }
        .tech-item--w2.tech-item--h3 .icon-wrapper { font-size: 2.8rem; }
        .tech-item--w3.tech-item--h3 .icon-wrapper { font-size: 3.2rem; }
        .tech-item--w4.tech-item--h3 .icon-wrapper { font-size: 3.5rem; }

        .label {
          font-weight: 700;
          letter-spacing: 0.3px;
          color: rgba(255,255,255,0.9);
          text-align: center;
          line-height: 1.2;
        }

        /* Responsive label sizing */
        .tech-item--w1 .label { font-size: 11px; }
        .tech-item--w2 .label { font-size: 13px; }
        .tech-item--w3 .label { font-size: 15px; }
        .tech-item--w4 .label { font-size: 16px; }

        /* Size indicator showing dimensions */
        .size-indicator {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 600;
        }

        .tech-item.resizing {
          z-index: 999;
        }

        .tech-item.resizing .tech-card {
          border-color: rgba(203, 172, 249, 0.8);
          box-shadow: 0 0 20px rgba(203, 172, 249, 0.3);
        }

        /* Resize handles - like textarea */
        .resize-handle {
          position: absolute;
          background: rgba(203, 172, 249, 0.8);
          transition: all 0.2s ease;
          opacity: 0;
          z-index: 10;
        }

        .tech-item:hover .resize-handle {
          opacity: 1;
        }

        .resize-handle:hover {
          background: rgba(203, 172, 249, 1);
          transform: scale(1.2);
        }

        /* Corner resize handle (southeast) */
        .resize-handle-se {
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          cursor: se-resize;
          border-radius: 0 0 16px 0;
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        /* Right edge resize handle */
        .resize-handle-e {
          top: 50%;
          right: 0;
          width: 4px;
          height: 30px;
          transform: translateY(-50%);
          cursor: e-resize;
          border-radius: 0 16px 16px 0;
        }

        /* Bottom edge resize handle */
        .resize-handle-s {
          bottom: 0;
          left: 50%;
          width: 30px;
          height: 4px;
          transform: translateX(-50%);
          cursor: s-resize;
          border-radius: 0 0 16px 16px;
        }

        /* Resize feedback */
        .tech-item.resizing .resize-handle {
          opacity: 1;
          background: rgba(203, 172, 249, 1);
          box-shadow: 0 0 10px rgba(203, 172, 249, 0.5);
        }

        /* Hover effects with brand colors */
        .tech-item:hover .tech-card {
          background: linear-gradient(135deg, var(--brand-bg1), var(--brand-bg2));
          color: var(--brand-fg);
          border-color: var(--brand-border);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .tech-item:hover .label {
          color: var(--brand-fg);
        }

        .tech-item:hover .icon-wrapper {
          color: var(--brand-fg);
        }

        .tech-item:hover .size-indicator {
          color: var(--brand-fg);
          opacity: 0.7;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .content { 
            gap: 4px; 
            padding: 12px; 
          }
          
          .tech-item--small .icon-wrapper,
          .tech-item--medium .icon-wrapper,
          .tech-item--large .icon-wrapper {
            font-size: 1.3rem;
          }
          
          .tech-item--small .label,
          .tech-item--medium .label,
          .tech-item--large .label {
            font-size: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default TechStack;