--- src/store/index.ts (原始)


+++ src/store/index.ts (修改后)
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  RoomConfig, WallConfig, DoorConfig, WindowConfig, SceneObject,
  Measurement, CameraPreset, LightingConfig, ShoppingItem, Tool,
  ViewMode, GridConfig, Project, ProductData, FurnitureCategory,
  Dimensions, RoomStyle, Unit
} from '../types';
import { Vector3Tuple } from 'three';

interface AppState {
  // Project
  project: Project;
  projectName: string;

  // UI State
  activeTool: Tool;
  viewMode: ViewMode;
  selectedIds: string[];
  showGrid: boolean;
  showOnboarding: boolean;
  presentationMode: boolean;
  showShoppingList: boolean;
  showHierarchy: boolean;
  contextMenu: { x: number; y: number; objectId: string } | null;

  // History
  history: any[];
  historyIndex: number;

  // Autosave
  lastSaved: number;

  // Actions
  setActiveTool: (tool: Tool) => void;
  setViewMode: (mode: ViewMode) => void;
  selectObject: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Room
  setRoomDimensions: (width: number, length: number, height: number, unit: Unit) => void;

  // Objects
  addObject: (product: ProductData, position?: Vector3Tuple) => string;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  duplicateObject: (id: string) => void;
  moveObject: (id: string, position: Vector3Tuple) => void;
  rotateObject: (id: string, rotation: Vector3Tuple) => void;
  scaleObject: (id: string, scale: Vector3Tuple) => void;
  lockObject: (id: string) => void;
  hideObject: (id: string) => void;
  renameObject: (id: string, name: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  // Doors
  addDoor: (wallId: string) => void;
  updateDoor: (id: string, updates: Partial<DoorConfig>) => void;
  removeDoor: (id: string) => void;

  // Windows
  addWindow: (wallId: string) => void;
  updateWindow: (id: string, updates: Partial<WindowConfig>) => void;
  removeWindow: (id: string) => void;

  // Measurements
  addMeasurement: (start: Vector3Tuple, end: Vector3Tuple) => void;
  removeMeasurement: (id: string) => void;
  clearMeasurements: () => void;

  // Camera
  addCameraPreset: (name: string, position: Vector3Tuple, target: Vector3Tuple) => void;
  removeCameraPreset: (id: string) => void;

  // Lighting
  setLighting: (lighting: Partial<LightingConfig>) => void;

  // Shopping
  addToShoppingList: (productId: string, name: string, price: number, currency: string, url?: string) => void;
  removeFromShoppingList: (productId: string) => void;
  updateShoppingQuantity: (productId: string, quantity: number) => void;

  // Grid
  setGridConfig: (config: Partial<GridConfig>) => void;

  // Style
  applyStyle: (styleName: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: (entry: any) => void;

  // Project
  saveProject: () => void;
  loadProject: (project: Project) => void;
  exportProject: () => string;
  importProject: (json: string) => void;
  newProject: () => void;

  // UI
  togglePresentationMode: () => void;
  toggleShoppingList: () => void;
  toggleHierarchy: () => void;
  setContextMenu: (menu: { x: number; y: number; objectId: string } | null) => void;
  dismissOnboarding: () => void;
  setLastSaved: (time: number) => void;
}

const DEFAULT_ROOM: RoomConfig = { width: 366, length: 427, height: 244, unit: 'cm' };

const DEFAULT_WALLS: WallConfig[] = [
  { id: 'wall-north', name: 'North Wall', color: '#f5f0eb', material: 'paint', thickness: 15 },
  { id: 'wall-south', name: 'South Wall', color: '#f5f0eb', material: 'paint', thickness: 15 },
  { id: 'wall-east', name: 'East Wall', color: '#f0ebe5', material: 'paint', thickness: 15 },
  { id: 'wall-west', name: 'West Wall', color: '#f0ebe5', material: 'paint', thickness: 15 },
];

const ROOM_STYLES: Record<string, RoomStyle> = {
  scandinavian: { name: 'Scandinavian', wallColor: '#f5f0eb', floorColor: '#c4a882', floorMaterial: 'wood', ceilingColor: '#ffffff', ambientColor: '#fff5e6', sunColor: '#fff8f0', accentColor: '#7ba3c9' },
  modern: { name: 'Modern', wallColor: '#e8e8e8', floorColor: '#8b8b8b', floorMaterial: 'concrete', ceilingColor: '#ffffff', ambientColor: '#f0f0f0', sunColor: '#ffffff', accentColor: '#2d2d2d' },
  minimal: { name: 'Minimal', wallColor: '#ffffff', floorColor: '#e0d8cf', floorMaterial: 'wood', ceilingColor: '#ffffff', ambientColor: '#ffffff', sunColor: '#ffffff', accentColor: '#333333' },
  cozy: { name: 'Cozy', wallColor: '#f0e6d8', floorColor: '#a0785a', floorMaterial: 'wood', ceilingColor: '#f5ede5', ambientColor: '#fff0d0', sunColor: '#ffe8c0', accentColor: '#c97b4b' },
  industrial: { name: 'Industrial', wallColor: '#d0ccc8', floorColor: '#6b6b6b', floorMaterial: 'concrete', ceilingColor: '#c0c0c0', ambientColor: '#e0ddd8', sunColor: '#f0ece5', accentColor: '#8b4513' },
  dark: { name: 'Dark', wallColor: '#2d2d35', floorColor: '#1a1a20', floorMaterial: 'wood', ceilingColor: '#252530', ambientColor: '#303040', sunColor: '#404050', accentColor: '#6366f1' },
  gaming: { name: 'Gaming', wallColor: '#1a1a2e', floorColor: '#16213e', floorMaterial: 'carpet', ceilingColor: '#0f0f1a', ambientColor: '#1a1a3e', sunColor: '#2a2a5e', accentColor: '#7c3aed' },
};

function createDemoProducts(): { product: ProductData; position: Vector3Tuple; rotation: Vector3Tuple }[] {
  return [
    {
      product: {
        id: 'prod-bed', name: 'MALM Bed Frame', price: 299, currency: 'USD',
        category: 'bed', dimensions: { width: 160, depth: 210, height: 90 },
        color: '#f5f0eb', materials: ['particleboard', 'foil'], source: 'library', isApproximation: true,
        url: 'https://www.ikea.com/us/en/p/malm-bed-frame-white-_00403782/'
      },
      position: [0, 0, -1.5] as Vector3Tuple,
      rotation: [0, 0, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-nightstand', name: 'MALM Nightstand', price: 79, currency: 'USD',
        category: 'nightstand', dimensions: { width: 48, depth: 40, height: 55 },
        color: '#f5f0eb', materials: ['particleboard', 'foil'], source: 'library', isApproximation: true,
        url: 'https://www.ikea.com/us/en/p/malm-nightstand-white-_30403778/'
      },
      position: [1.2, 0, -1.8] as Vector3Tuple,
      rotation: [0, 0, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-desk', name: 'MICKE Desk', price: 179, currency: 'USD',
        category: 'desk', dimensions: { width: 105, depth: 50, height: 75 },
        color: '#ffffff', materials: ['particleboard', 'foil'], source: 'library', isApproximation: true,
        url: 'https://www.ikea.com/us/en/p/micke-desk-white-_70211150/'
      },
      position: [-1.5, 0, 1.5] as Vector3Tuple,
      rotation: [0, Math.PI, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-chair', name: 'MARKUS Chair', price: 249, currency: 'USD',
        category: 'chair', dimensions: { width: 62, depth: 60, height: 128 },
        color: '#333333', materials: ['steel', 'fabric'], source: 'library', isApproximation: true,
        url: 'https://www.ikea.com/us/en/p/markus-office-chair-vissle-dark-gray-_90289172/'
      },
      position: [-1.5, 0, 0.8] as Vector3Tuple,
      rotation: [0, Math.PI, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-dresser', name: 'MALM 6-drawer', price: 199, currency: 'USD',
        category: 'dresser', dimensions: { width: 160, depth: 48, height: 78 },
        color: '#f5f0eb', materials: ['particleboard', 'foil'], source: 'library', isApproximation: true,
        url: 'https://www.ikea.com/us/en/p/malm-6-drawer-dresser-white-_00403782/'
      },
      position: [0, 0, 1.8] as Vector3Tuple,
      rotation: [0, Math.PI, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-rug', name: 'VINDUM Rug', price: 99, currency: 'USD',
        category: 'rug', dimensions: { width: 200, depth: 150, height: 2 },
        color: '#c4b5a0', materials: ['polyester'], source: 'library', isApproximation: true,
      },
      position: [0, 0.01, 0] as Vector3Tuple,
      rotation: [0, 0, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-plant', name: 'FEJKA Artificial Plant', price: 19, currency: 'USD',
        category: 'plant', dimensions: { width: 30, depth: 30, height: 80 },
        color: '#4a7c59', materials: ['plastic'], source: 'library', isApproximation: true,
      },
      position: [1.5, 0, 1.5] as Vector3Tuple,
      rotation: [0, 0, 0] as Vector3Tuple,
    },
    {
      product: {
        id: 'prod-lamp', name: 'HEKTAR Floor Lamp', price: 49, currency: 'USD',
        category: 'lamp', dimensions: { width: 28, depth: 28, height: 160 },
        color: '#333333', materials: ['steel'], source: 'library', isApproximation: true,
      },
      position: [-1.5, 0, -1.8] as Vector3Tuple,
      rotation: [0, 0, 0] as Vector3Tuple,
    },
  ];
}

function createDefaultProject(): Project {
  const demo = createDemoProducts();
  const objects: SceneObject[] = demo.map((d, i) => ({
    id: uuidv4(),
    productId: d.product.id,
    name: d.product.name,
    position: d.position,
    rotation: d.rotation,
    scale: [1, 1, 1] as Vector3Tuple,
    locked: false,
    hidden: false,
    product: d.product,
  }));

  return {
    id: uuidv4(),
    name: 'My Bedroom',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    room: DEFAULT_ROOM,
    walls: DEFAULT_WALLS,
    doors: [{
      id: uuidv4(), name: 'Bedroom Door', wallId: 'wall-south',
      position: 0.3, width: 80, height: 210, color: '#f5f0eb',
      swingDirection: 'left', isOpen: false,
    }],
    windows: [{
      id: uuidv4(), name: 'Main Window', wallId: 'wall-north',
      position: 0.5, width: 120, height: 120, sillHeight: 90,
      frameColor: '#ffffff', glassColor: '#a8d4e6',
    }],
    objects,
    measurements: [],
    cameraPresets: [
      { id: uuidv4(), name: 'Overview', position: [4, 3, 4], target: [0, 0, 0] },
      { id: uuidv4(), name: 'Top Down', position: [0, 5, 0], target: [0, 0, 0] },
    ],
    lighting: { timeOfDay: 0.5, ambientIntensity: 0.4, sunIntensity: 1.0, shadowIntensity: 0.5, warmCool: 0.5 },
    shoppingList: demo.map(d => ({
      productId: d.product.id, name: d.product.name,
      price: d.product.price || 0, currency: d.product.currency,
      quantity: 1, url: d.product.url,
    })),
    grid: { visible: true, size: 10, divisions: 20, snapEnabled: true, snapSize: 0.1 },
    style: 'scandinavian',
  };
}

export const useStore = create<AppState>((set, get) => ({
  project: createDefaultProject(),
  projectName: 'My Bedroom',
  activeTool: 'select',
  viewMode: 'orbit',
  selectedIds: [],
  showGrid: true,
  showOnboarding: true,
  presentationMode: false,
  showShoppingList: false,
  showHierarchy: true,
  contextMenu: null,
  history: [],
  historyIndex: -1,
  lastSaved: Date.now(),

  setActiveTool: (tool) => set({ activeTool: tool }),
  setViewMode: (mode) => set({ viewMode: mode }),

  selectObject: (id, multi = false) => {
    const state = get();
    if (multi) {
      const exists = state.selectedIds.includes(id);
      set({ selectedIds: exists ? state.selectedIds.filter(i => i !== id) : [...state.selectedIds, id] });
    } else {
      set({ selectedIds: [id] });
    }
  },

  clearSelection: () => set({ selectedIds: [] }),
  selectAll: () => set({ selectedIds: get().project.objects.map(o => o.id) }),

  setRoomDimensions: (width, length, height, unit) => {
    set(state => ({
      project: { ...state.project, room: { width, length, height, unit }, updatedAt: new Date().toISOString() }
    }));
  },

  addObject: (product, position = [0, 0, 0]) => {
    const id = uuidv4();
    const obj: SceneObject = {
      id, productId: product.id, name: product.name,
      position, rotation: [0, 0, 0], scale: [1, 1, 1],
      locked: false, hidden: false, product,
    };
    set(state => ({
      project: { ...state.project, objects: [...state.project.objects, obj], updatedAt: new Date().toISOString() },
      selectedIds: [id],
    }));
    return id;
  },

  removeObject: (id) => {
    set(state => ({
      project: { ...state.project, objects: state.project.objects.filter(o => o.id !== id), updatedAt: new Date().toISOString() },
      selectedIds: state.selectedIds.filter(i => i !== id),
    }));
  },

  updateObject: (id, updates) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, ...updates } : o),
        updatedAt: new Date().toISOString(),
      }
    }));
  },

  duplicateObject: (id) => {
    const state = get();
    const obj = state.project.objects.find(o => o.id === id);
    if (!obj) return;
    const newId = uuidv4();
    const newObj: SceneObject = {
      ...obj, id: newId, name: `${obj.name} (copy)`,
      position: [obj.position[0] + 0.3, obj.position[1], obj.position[2] + 0.3] as Vector3Tuple,
    };
    set(state => ({
      project: { ...state.project, objects: [...state.project.objects, newObj], updatedAt: new Date().toISOString() },
      selectedIds: [newId],
    }));
  },

  moveObject: (id, position) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, position } : o),
        updatedAt: new Date().toISOString(),
      }
    }));
  },

  rotateObject: (id, rotation) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, rotation } : o),
        updatedAt: new Date().toISOString(),
      }
    }));
  },

  scaleObject: (id, scale) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, scale } : o),
        updatedAt: new Date().toISOString(),
      }
    }));
  },

  lockObject: (id) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, locked: !o.locked } : o),
      }
    }));
  },

  hideObject: (id) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, hidden: !o.hidden } : o),
      }
    }));
  },

  renameObject: (id, name) => {
    set(state => ({
      project: {
        ...state.project,
        objects: state.project.objects.map(o => o.id === id ? { ...o, name } : o),
      }
    }));
  },

  deleteSelected: () => {
    const state = get();
    set({
      project: { ...state.project, objects: state.project.objects.filter(o => !state.selectedIds.includes(o.id)), updatedAt: new Date().toISOString() },
      selectedIds: [],
    });
  },

  duplicateSelected: () => {
    const state = get();
    const newIds: string[] = [];
    const newObjects = state.selectedIds.map(id => {
      const obj = state.project.objects.find(o => o.id === id);
      if (!obj) return null;
      const newId = uuidv4();
      newIds.push(newId);
      return {
        ...obj, id: newId, name: `${obj.name} (copy)`,
        position: [obj.position[0] + 0.3, obj.position[1], obj.position[2] + 0.3] as Vector3Tuple,
      };
    }).filter(Boolean) as SceneObject[];

    set(state => ({
      project: { ...state.project, objects: [...state.project.objects, ...newObjects], updatedAt: new Date().toISOString() },
      selectedIds: newIds,
    }));
  },

  addDoor: (wallId) => {
    const door: DoorConfig = {
      id: uuidv4(), name: 'New Door', wallId, position: 0.5,
      width: 80, height: 210, color: '#f5f0eb', swingDirection: 'left', isOpen: false,
    };
    set(state => ({
      project: { ...state.project, doors: [...state.project.doors, door], updatedAt: new Date().toISOString() }
    }));
  },

  updateDoor: (id, updates) => {
    set(state => ({
      project: { ...state.project, doors: state.project.doors.map(d => d.id === id ? { ...d, ...updates } : d) }
    }));
  },

  removeDoor: (id) => {
    set(state => ({
      project: { ...state.project, doors: state.project.doors.filter(d => d.id !== id) }
    }));
  },

  addWindow: (wallId) => {
    const win: WindowConfig = {
      id: uuidv4(), name: 'New Window', wallId, position: 0.5,
      width: 120, height: 120, sillHeight: 90, frameColor: '#ffffff', glassColor: '#a8d4e6',
    };
    set(state => ({
      project: { ...state.project, windows: [...state.project.windows, win], updatedAt: new Date().toISOString() }
    }));
  },

  updateWindow: (id, updates) => {
    set(state => ({
      project: { ...state.project, windows: state.project.windows.map(w => w.id === id ? { ...w, ...updates } : w) }
    }));
  },

  removeWindow: (id) => {
    set(state => ({
      project: { ...state.project, windows: state.project.windows.filter(w => w.id !== id) }
    }));
  },

  addMeasurement: (start, end) => {
    const m: Measurement = { id: uuidv4(), start, end, unit: get().project.room.unit };
    set(state => ({
      project: { ...state.project, measurements: [...state.project.measurements, m] }
    }));
  },

  removeMeasurement: (id) => {
    set(state => ({
      project: { ...state.project, measurements: state.project.measurements.filter(m => m.id !== id) }
    }));
  },

  clearMeasurements: () => {
    set(state => ({ project: { ...state.project, measurements: [] } }));
  },

  addCameraPreset: (name, position, target) => {
    const preset: CameraPreset = { id: uuidv4(), name, position, target };
    set(state => ({
      project: { ...state.project, cameraPresets: [...state.project.cameraPresets, preset] }
    }));
  },

  removeCameraPreset: (id) => {
    set(state => ({
      project: { ...state.project, cameraPresets: state.project.cameraPresets.filter(c => c.id !== id) }
    }));
  },

  setLighting: (lighting) => {
    set(state => ({
      project: { ...state.project, lighting: { ...state.project.lighting, ...lighting } }
    }));
  },

  addToShoppingList: (productId, name, price, currency, url) => {
    const existing = get().project.shoppingList.find(s => s.productId === productId);
    if (existing) {
      set(state => ({
        project: { ...state.project, shoppingList: state.project.shoppingList.map(s => s.productId === productId ? { ...s, quantity: s.quantity + 1 } : s) }
      }));
    } else {
      set(state => ({
        project: { ...state.project, shoppingList: [...state.project.shoppingList, { productId, name, price, currency, quantity: 1, url }] }
      }));
    }
  },

  removeFromShoppingList: (productId) => {
    set(state => ({
      project: { ...state.project, shoppingList: state.project.shoppingList.filter(s => s.productId !== productId) }
    }));
  },

  updateShoppingQuantity: (productId, quantity) => {
    set(state => ({
      project: { ...state.project, shoppingList: state.project.shoppingList.map(s => s.productId === productId ? { ...s, quantity } : s) }
    }));
  },

  setGridConfig: (config) => {
    set(state => ({
      project: { ...state.project, grid: { ...state.project.grid, ...config } }
    }));
  },

  applyStyle: (styleName) => {
    const style = ROOM_STYLES[styleName];
    if (!style) return;
    set(state => ({
      project: {
        ...state.project,
        style: styleName,
        walls: state.project.walls.map(w => ({ ...w, color: style.wallColor })),
      }
    }));
  },

  pushHistory: (entry) => {
    set(state => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(entry);
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex < 0) return;
    // Simplified undo - restore previous project state
    set({ historyIndex: state.historyIndex - 1 });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;
    set({ historyIndex: state.historyIndex + 1 });
  },

  saveProject: () => {
    const state = get();
    const data = JSON.stringify(state.project);
    localStorage.setItem('roomlab-project', data);
    localStorage.setItem('roomlab-project-time', Date.now().toString());
    set({ lastSaved: Date.now() });
  },

  loadProject: (project) => {
    set({ project, selectedIds: [] });
  },

  exportProject: () => {
    return JSON.stringify(get().project, null, 2);
  },

  importProject: (json) => {
    try {
      const project = JSON.parse(json) as Project;
      set({ project, selectedIds: [] });
    } catch (e) {
      console.error('Invalid project JSON');
    }
  },

  newProject: () => {
    set({ project: createDefaultProject(), selectedIds: [], history: [], historyIndex: -1 });
  },

  togglePresentationMode: () => set(state => ({ presentationMode: !state.presentationMode })),
  toggleShoppingList: () => set(state => ({ showShoppingList: !state.showShoppingList })),
  toggleHierarchy: () => set(state => ({ showHierarchy: !state.showHierarchy })),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  dismissOnboarding: () => set({ showOnboarding: false }),
  setLastSaved: (time) => set({ lastSaved: time }),
}));
