--- src/utils/proceduralFurniture.ts (原始)


+++ src/utils/proceduralFurniture.ts (修改后)
import { FurnitureCategory, Dimensions } from '../types';

export interface ProceduralModel {
  type: string;
  parts: ProceduralPart[];
}

export interface ProceduralPart {
  shape: 'box' | 'cylinder' | 'sphere' | 'plane';
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
}

function darken(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function lighten(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function generateProceduralModel(category: FurnitureCategory, dimensions: Dimensions, color: string): ProceduralModel {
  const w = dimensions.width / 100; // Convert cm to meters
  const d = dimensions.depth / 100;
  const h = dimensions.height / 100;

  switch (category) {
    case 'bed': return generateBed(w, d, h, color);
    case 'desk': return generateDesk(w, d, h, color);
    case 'chair': return generateChair(w, d, h, color);
    case 'dresser': return generateDresser(w, d, h, color);
    case 'nightstand': return generateNightstand(w, d, h, color);
    case 'bookshelf': return generateBookshelf(w, d, h, color);
    case 'wardrobe': return generateWardrobe(w, d, h, color);
    case 'lamp': return generateLamp(w, d, h, color);
    case 'plant': return generatePlant(w, d, h, color);
    case 'rug': return generateRug(w, d, h, color);
    case 'monitor': return generateMonitor(w, d, h, color);
    case 'sofa': return generateSofa(w, d, h, color);
    case 'table': return generateTable(w, d, h, color);
    default: return generateGenericBox(w, d, h, color);
  }
}

function generateBed(w: number, d: number, h: number, color: string): ProceduralModel {
  const frameH = h * 0.35;
  const mattressH = h * 0.25;
  const headboardH = h * 0.8;
  const legSize = 0.06;

  return {
    type: 'bed',
    parts: [
      // Frame
      { shape: 'box', position: [0, frameH / 2, 0], size: [w, frameH, d], color: darken(color, 20), roughness: 0.7 },
      // Mattress
      { shape: 'box', position: [0, frameH + mattressH / 2, -0.05], size: [w - 0.04, mattressH, d - 0.04], color: '#f8f8f8', roughness: 0.9 },
      // Headboard
      { shape: 'box', position: [0, headboardH / 2, -d / 2 + 0.03], size: [w, headboardH, 0.06], color: color, roughness: 0.5 },
      // Pillow 1
      { shape: 'box', position: [-w * 0.25, frameH + mattressH + 0.05, -d * 0.35], size: [0.5, 0.1, 0.35], color: '#ffffff', roughness: 0.95 },
      // Pillow 2
      { shape: 'box', position: [w * 0.25, frameH + mattressH + 0.05, -d * 0.35], size: [0.5, 0.1, 0.35], color: '#ffffff', roughness: 0.95 },
      // Blanket
      { shape: 'box', position: [0, frameH + mattressH + 0.03, d * 0.15], size: [w - 0.08, 0.06, d * 0.5], color: lighten(color, 30), roughness: 0.95 },
      // Legs
      { shape: 'cylinder', position: [-w / 2 + legSize, legSize / 2, -d / 2 + legSize], size: [legSize, legSize, legSize], color: darken(color, 40), metalness: 0.3 },
      { shape: 'cylinder', position: [w / 2 - legSize, legSize / 2, -d / 2 + legSize], size: [legSize, legSize, legSize], color: darken(color, 40), metalness: 0.3 },
      { shape: 'cylinder', position: [-w / 2 + legSize, legSize / 2, d / 2 - legSize], size: [legSize, legSize, legSize], color: darken(color, 40), metalness: 0.3 },
      { shape: 'cylinder', position: [w / 2 - legSize, legSize / 2, d / 2 - legSize], size: [legSize, legSize, legSize], color: darken(color, 40), metalness: 0.3 },
    ],
  };
}

function generateDesk(w: number, d: number, h: number, color: string): ProceduralModel {
  const topThickness = 0.03;
  const legSize = 0.04;
  const drawerH = 0.15;

  return {
    type: 'desk',
    parts: [
      // Desktop
      { shape: 'box', position: [0, h - topThickness / 2, 0], size: [w, topThickness, d], color: color, roughness: 0.4 },
      // Left panel
      { shape: 'box', position: [-w / 2 + 0.015, (h - topThickness) / 2, 0], size: [0.03, h - topThickness, d - 0.04], color: darken(color, 15), roughness: 0.5 },
      // Right panel
      { shape: 'box', position: [w / 2 - 0.015, (h - topThickness) / 2, 0], size: [0.03, h - topThickness, d - 0.04], color: darken(color, 15), roughness: 0.5 },
      // Back panel
      { shape: 'box', position: [0, (h - topThickness) / 2, -d / 2 + 0.01], size: [w - 0.06, h - topThickness, 0.02], color: darken(color, 10), roughness: 0.6 },
      // Drawer unit
      { shape: 'box', position: [w * 0.25, drawerH / 2 + 0.05, 0], size: [w * 0.35, drawerH * 2, d - 0.08], color: darken(color, 5), roughness: 0.5 },
      // Drawer handles
      { shape: 'box', position: [w * 0.25, drawerH + 0.05, d / 2 - 0.04], size: [0.08, 0.015, 0.015], color: '#888888', metalness: 0.8, roughness: 0.2 },
      { shape: 'box', position: [w * 0.25, drawerH * 0.4 + 0.05, d / 2 - 0.04], size: [0.08, 0.015, 0.015], color: '#888888', metalness: 0.8, roughness: 0.2 },
    ],
  };
}

function generateChair(w: number, d: number, h: number, color: string): ProceduralModel {
  const seatH = 0.45;
  const seatThickness = 0.06;
  const backH = h - seatH;

  return {
    type: 'chair',
    parts: [
      // Base (5-star)
      { shape: 'cylinder', position: [0, 0.03, 0], size: [0.3, 0.3, 0.06], color: '#444444', metalness: 0.7, roughness: 0.3 },
      // Gas lift
      { shape: 'cylinder', position: [0, seatH / 2, 0], size: [0.04, 0.04, seatH - 0.1], color: '#333333', metalness: 0.6, roughness: 0.3 },
      // Seat
      { shape: 'box', position: [0, seatH, 0.02], size: [w * 0.85, seatThickness, d * 0.8], color: color, roughness: 0.85 },
      // Backrest
      { shape: 'box', position: [0, seatH + backH / 2, -d * 0.35], size: [w * 0.8, backH * 0.85, 0.06], color: color, roughness: 0.85 },
      // Armrests
      { shape: 'box', position: [-w * 0.38, seatH + 0.15, -0.02], size: [0.06, 0.04, d * 0.4], color: '#333333', roughness: 0.5 },
      { shape: 'box', position: [w * 0.38, seatH + 0.15, -0.02], size: [0.06, 0.04, d * 0.4], color: '#333333', roughness: 0.5 },
      // Armrest supports
      { shape: 'cylinder', position: [-w * 0.38, seatH + 0.08, -0.02], size: [0.025, 0.025, 0.15], color: '#444444', metalness: 0.5 },
      { shape: 'cylinder', position: [w * 0.38, seatH + 0.08, -0.02], size: [0.025, 0.025, 0.15], color: '#444444', metalness: 0.5 },
    ],
  };
}

function generateDresser(w: number, d: number, h: number, color: string): ProceduralModel {
  const numDrawers = 6;
  const drawerH = (h - 0.04) / numDrawers;
  const parts: ProceduralPart[] = [];

  // Main body
  parts.push({ shape: 'box', position: [0, h / 2, 0], size: [w, h, d], color: darken(color, 10), roughness: 0.6 });

  // Top surface
  parts.push({ shape: 'box', position: [0, h + 0.01, 0], size: [w + 0.02, 0.02, d + 0.01], color: color, roughness: 0.4 });

  // Drawers and handles
  for (let i = 0; i < numDrawers; i++) {
    const y = 0.02 + drawerH * i + drawerH / 2;
    parts.push({
      shape: 'box', position: [0, y, d / 2 - 0.005],
      size: [w - 0.04, drawerH - 0.01, 0.02],
      color: color, roughness: 0.5,
    });
    // Handle
    parts.push({
      shape: 'box', position: [0, y, d / 2 + 0.01],
      size: [0.08, 0.015, 0.02],
      color: '#999999', metalness: 0.8, roughness: 0.2,
    });
  }

  // Feet
  const footH = 0.04;
  parts.push({ shape: 'box', position: [-w / 2 + 0.04, footH / 2, d / 2 - 0.04], size: [0.06, footH, 0.06], color: darken(color, 30) });
  parts.push({ shape: 'box', position: [w / 2 - 0.04, footH / 2, d / 2 - 0.04], size: [0.06, footH, 0.06], color: darken(color, 30) });
  parts.push({ shape: 'box', position: [-w / 2 + 0.04, footH / 2, -d / 2 + 0.04], size: [0.06, footH, 0.06], color: darken(color, 30) });
  parts.push({ shape: 'box', position: [w / 2 - 0.04, footH / 2, -d / 2 + 0.04], size: [0.06, footH, 0.06], color: darken(color, 30) });

  return { type: 'dresser', parts };
}

function generateNightstand(w: number, d: number, h: number, color: string): ProceduralModel {
  const parts: ProceduralPart[] = [];

  // Body
  parts.push({ shape: 'box', position: [0, h / 2, 0], size: [w, h - 0.04, d], color: darken(color, 8), roughness: 0.6 });

  // Top
  parts.push({ shape: 'box', position: [0, h - 0.01, 0], size: [w + 0.02, 0.02, d + 0.01], color: color, roughness: 0.4 });

  // Drawer
  parts.push({
    shape: 'box', position: [0, h * 0.6, d / 2 - 0.005],
    size: [w - 0.04, h * 0.35, 0.02],
    color: color, roughness: 0.5,
  });

  // Drawer handle
  parts.push({
    shape: 'box', position: [0, h * 0.6, d / 2 + 0.01],
    size: [0.06, 0.012, 0.02],
    color: '#999999', metalness: 0.8, roughness: 0.2,
  });

  // Open shelf
  parts.push({
    shape: 'box', position: [0, h * 0.2, d / 2 - 0.005],
    size: [w - 0.04, h * 0.3, 0.02],
    color: darken(color, 15), roughness: 0.6,
  });

  // Legs
  const legH = 0.12;
  parts.push({ shape: 'cylinder', position: [-w / 2 + 0.03, legH / 2, d / 2 - 0.03], size: [0.025, 0.025, legH], color: darken(color, 30) });
  parts.push({ shape: 'cylinder', position: [w / 2 - 0.03, legH / 2, d / 2 - 0.03], size: [0.025, 0.025, legH], color: darken(color, 30) });
  parts.push({ shape: 'cylinder', position: [-w / 2 + 0.03, legH / 2, -d / 2 + 0.03], size: [0.025, 0.025, legH], color: darken(color, 30) });
  parts.push({ shape: 'cylinder', position: [w / 2 - 0.03, legH / 2, -d / 2 + 0.03], size: [0.025, 0.025, legH], color: darken(color, 30) });

  return { type: 'nightstand', parts };
}

function generateBookshelf(w: number, d: number, h: number, color: string): ProceduralModel {
  const parts: ProceduralPart[] = [];
  const shelfCount = 5;
  const thickness = 0.02;

  // Side panels
  parts.push({ shape: 'box', position: [-w / 2 + thickness / 2, h / 2, 0], size: [thickness, h, d], color: color, roughness: 0.5 });
  parts.push({ shape: 'box', position: [w / 2 - thickness / 2, h / 2, 0], size: [thickness, h, d], color: color, roughness: 0.5 });

  // Back panel
  parts.push({ shape: 'box', position: [0, h / 2, -d / 2 + 0.005], size: [w, h, 0.01], color: darken(color, 15), roughness: 0.7 });

  // Shelves
  for (let i = 0; i <= shelfCount; i++) {
    const y = (h / shelfCount) * i;
    parts.push({
      shape: 'box', position: [0, y + thickness / 2, 0],
      size: [w - thickness * 2, thickness, d],
      color: color, roughness: 0.5,
    });
  }

  return { type: 'bookshelf', parts };
}

function generateWardrobe(w: number, d: number, h: number, color: string): ProceduralModel {
  const parts: ProceduralPart[] = [];

  // Body
  parts.push({ shape: 'box', position: [0, h / 2, 0], size: [w, h, d], color: darken(color, 5), roughness: 0.6 });

  // Doors
  parts.push({
    shape: 'box', position: [-w / 4, h / 2, d / 2 - 0.01],
    size: [w / 2 - 0.02, h - 0.04, 0.02],
    color: color, roughness: 0.4,
  });
  parts.push({
    shape: 'box', position: [w / 4, h / 2, d / 2 - 0.01],
    size: [w / 2 - 0.02, h - 0.04, 0.02],
    color: color, roughness: 0.4,
  });

  // Handles
  parts.push({
    shape: 'cylinder', position: [-0.03, h * 0.55, d / 2 + 0.01],
    size: [0.015, 0.015, 0.12],
    color: '#aaaaaa', metalness: 0.8, roughness: 0.2,
    rotation: [0, 0, 0],
  });
  parts.push({
    shape: 'cylinder', position: [0.03, h * 0.55, d / 2 + 0.01],
    size: [0.015, 0.015, 0.12],
    color: '#aaaaaa', metalness: 0.8, roughness: 0.2,
    rotation: [0, 0, 0],
  });

  return { type: 'wardrobe', parts };
}

function generateLamp(w: number, d: number, h: number, color: string): ProceduralModel {
  return {
    type: 'lamp',
    parts: [
      // Base
      { shape: 'cylinder', position: [0, 0.02, 0], size: [w * 0.8, w * 0.8, 0.04], color: color, metalness: 0.6, roughness: 0.3 },
      // Stem
      { shape: 'cylinder', position: [0, h * 0.45, 0], size: [0.02, 0.02, h * 0.85], color: color, metalness: 0.7, roughness: 0.3 },
      // Shade
      { shape: 'cylinder', position: [0, h * 0.85, 0], size: [w * 0.6, w * 0.4, h * 0.2], color: '#f5f0e8', roughness: 0.9, opacity: 0.9 },
      // Light bulb glow
      { shape: 'sphere', position: [0, h * 0.8, 0], size: [0.05, 0.05, 0.05], color: '#fff5e0', roughness: 0, opacity: 0.8 },
    ],
  };
}

function generatePlant(w: number, d: number, h: number, color: string): ProceduralModel {
  const potH = h * 0.3;
  return {
    type: 'plant',
    parts: [
      // Pot
      { shape: 'cylinder', position: [0, potH / 2, 0], size: [w * 0.7, w * 0.5, potH], color: '#8b6f47', roughness: 0.8 },
      // Soil
      { shape: 'cylinder', position: [0, potH, 0], size: [w * 0.45, w * 0.45, 0.02], color: '#3d2b1f', roughness: 0.95 },
      // Foliage clusters
      { shape: 'sphere', position: [0, h * 0.6, 0], size: [w * 0.8, w * 0.8, w * 0.8], color: color, roughness: 0.9 },
      { shape: 'sphere', position: [w * 0.2, h * 0.7, w * 0.1], size: [w * 0.5, w * 0.5, w * 0.5], color: lighten(color, 20), roughness: 0.9 },
      { shape: 'sphere', position: [-w * 0.15, h * 0.75, -w * 0.1], size: [w * 0.4, w * 0.4, w * 0.4], color: darken(color, 15), roughness: 0.9 },
      { shape: 'sphere', position: [w * 0.1, h * 0.85, 0], size: [w * 0.3, w * 0.3, w * 0.3], color: lighten(color, 10), roughness: 0.9 },
    ],
  };
}

function generateRug(w: number, d: number, h: number, color: string): ProceduralModel {
  return {
    type: 'rug',
    parts: [
      { shape: 'box', position: [0, 0.005, 0], size: [w, 0.01, d], color: color, roughness: 0.95 },
      // Border
      { shape: 'box', position: [0, 0.006, 0], size: [w - 0.1, 0.01, d - 0.1], color: darken(color, 20), roughness: 0.95 },
      // Inner pattern
      { shape: 'box', position: [0, 0.007, 0], size: [w - 0.3, 0.01, d - 0.3], color: lighten(color, 10), roughness: 0.95 },
    ],
  };
}

function generateMonitor(w: number, d: number, h: number, color: string): ProceduralModel {
  return {
    type: 'monitor',
    parts: [
      // Screen
      { shape: 'box', position: [0, h * 0.6, -d * 0.1], size: [w, h * 0.55, 0.03], color: '#1a1a1a', roughness: 0.3 },
      // Screen face
      { shape: 'box', position: [0, h * 0.62, -d * 0.1 + 0.016], size: [w - 0.04, h * 0.5, 0.005], color: '#2a3a4a', roughness: 0.1, metalness: 0.1 },
      // Stand neck
      { shape: 'box', position: [0, h * 0.2, -d * 0.1], size: [0.05, h * 0.3, 0.05], color: '#333333', metalness: 0.6, roughness: 0.3 },
      // Stand base
      { shape: 'cylinder', position: [0, 0.01, 0], size: [w * 0.4, w * 0.25, 0.02], color: '#333333', metalness: 0.6, roughness: 0.3 },
    ],
  };
}

function generateSofa(w: number, d: number, h: number, color: string): ProceduralModel {
  const seatH = h * 0.4;
  const backH = h * 0.5;
  const armW = 0.12;

  return {
    type: 'sofa',
    parts: [
      // Base
      { shape: 'box', position: [0, seatH / 2, 0], size: [w, seatH, d], color: darken(color, 15), roughness: 0.85 },
      // Seat cushions
      { shape: 'box', position: [-w * 0.25, seatH + 0.05, 0.05], size: [w * 0.45, 0.1, d * 0.7], color: color, roughness: 0.9 },
      { shape: 'box', position: [w * 0.25, seatH + 0.05, 0.05], size: [w * 0.45, 0.1, d * 0.7], color: color, roughness: 0.9 },
      // Back
      { shape: 'box', position: [0, seatH + backH / 2, -d / 2 + 0.1], size: [w - armW * 2, backH, 0.2], color: color, roughness: 0.9 },
      // Arms
      { shape: 'box', position: [-w / 2 + armW / 2, seatH + 0.1, 0], size: [armW, h * 0.35, d - 0.1], color: darken(color, 10), roughness: 0.85 },
      { shape: 'box', position: [w / 2 - armW / 2, seatH + 0.1, 0], size: [armW, h * 0.35, d - 0.1], color: darken(color, 10), roughness: 0.85 },
      // Legs
      { shape: 'cylinder', position: [-w / 2 + 0.08, 0.04, d / 2 - 0.08], size: [0.03, 0.03, 0.08], color: '#333333', metalness: 0.5 },
      { shape: 'cylinder', position: [w / 2 - 0.08, 0.04, d / 2 - 0.08], size: [0.03, 0.03, 0.08], color: '#333333', metalness: 0.5 },
      { shape: 'cylinder', position: [-w / 2 + 0.08, 0.04, -d / 2 + 0.08], size: [0.03, 0.03, 0.08], color: '#333333', metalness: 0.5 },
      { shape: 'cylinder', position: [w / 2 - 0.08, 0.04, -d / 2 + 0.08], size: [0.03, 0.03, 0.08], color: '#333333', metalness: 0.5 },
    ],
  };
}

function generateTable(w: number, d: number, h: number, color: string): ProceduralModel {
  const topThickness = 0.03;
  const legSize = 0.04;

  return {
    type: 'table',
    parts: [
      // Top
      { shape: 'box', position: [0, h - topThickness / 2, 0], size: [w, topThickness, d], color: color, roughness: 0.4 },
      // Legs
      { shape: 'box', position: [-w / 2 + legSize, (h - topThickness) / 2, -d / 2 + legSize], size: [legSize, h - topThickness, legSize], color: darken(color, 20), roughness: 0.5 },
      { shape: 'box', position: [w / 2 - legSize, (h - topThickness) / 2, -d / 2 + legSize], size: [legSize, h - topThickness, legSize], color: darken(color, 20), roughness: 0.5 },
      { shape: 'box', position: [-w / 2 + legSize, (h - topThickness) / 2, d / 2 - legSize], size: [legSize, h - topThickness, legSize], color: darken(color, 20), roughness: 0.5 },
      { shape: 'box', position: [w / 2 - legSize, (h - topThickness) / 2, d / 2 - legSize], size: [legSize, h - topThickness, legSize], color: darken(color, 20), roughness: 0.5 },
    ],
  };
}

function generateGenericBox(w: number, d: number, h: number, color: string): ProceduralModel {
  return {
    type: 'generic',
    parts: [
      { shape: 'box', position: [0, h / 2, 0], size: [w, h, d], color: color, roughness: 0.5 },
    ],
  };
}
