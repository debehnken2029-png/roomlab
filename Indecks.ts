--- src/types/index.ts (原始)


+++ src/types/index.ts (修改后)
import { Vector3Tuple } from 'three';

export type Unit = 'cm' | 'm' | 'in' | 'ft';

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
}

export interface RoomConfig {
  width: number;
  length: number;
  height: number;
  unit: Unit;
}

export interface WallConfig {
  id: string;
  name: string;
  color: string;
  material: string;
  thickness: number;
}

export interface DoorConfig {
  id: string;
  name: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  color: string;
  swingDirection: 'left' | 'right';
  isOpen: boolean;
}

export interface WindowConfig {
  id: string;
  name: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  sillHeight: number;
  frameColor: string;
  glassColor: string;
}

export type FurnitureCategory = 'bed' | 'desk' | 'chair' | 'dresser' | 'nightstand' | 'bookshelf' | 'wardrobe' | 'lamp' | 'plant' | 'rug' | 'monitor' | 'sofa' | 'table' | 'custom';

export interface ProductData {
  id: string;
  name: string;
  url?: string;
  price?: number;
  currency: string;
  category: FurnitureCategory;
  dimensions: Dimensions;
  weight?: number;
  color: string;
  materials: string[];
  image?: string;
  source: 'ikea' | 'manual' | 'library';
  isApproximation: boolean;
  metadata?: Record<string, string>;
}

export interface SceneObject {
  id: string;
  productId: string;
  name: string;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  locked: boolean;
  hidden: boolean;
  product: ProductData;
}

export interface Measurement {
  id: string;
  start: Vector3Tuple;
  end: Vector3Tuple;
  unit: Unit;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: Vector3Tuple;
  target: Vector3Tuple;
}

export interface LightingConfig {
  timeOfDay: number;
  ambientIntensity: number;
  sunIntensity: number;
  shadowIntensity: number;
  warmCool: number;
}

export interface MaterialPreset {
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
}

export interface ShoppingItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  url?: string;
}

export type Tool = 'select' | 'move' | 'rotate' | 'scale' | 'measure' | 'wall' | 'door' | 'window' | 'object';

export type ViewMode = 'orbit' | 'first-person' | 'top-down';

export interface GridConfig {
  visible: boolean;
  size: number;
  divisions: number;
  snapEnabled: boolean;
  snapSize: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  room: RoomConfig;
  walls: WallConfig[];
  doors: DoorConfig[];
  windows: WindowConfig[];
  objects: SceneObject[];
  measurements: Measurement[];
  cameraPresets: CameraPreset[];
  lighting: LightingConfig;
  shoppingList: ShoppingItem[];
  grid: GridConfig;
  style: string;
}

export interface HistoryEntry {
  type: string;
  data: any;
  timestamp: number;
}

export interface RoomStyle {
  name: string;
  wallColor: string;
  floorColor: string;
  floorMaterial: string;
  ceilingColor: string;
  ambientColor: string;
  sunColor: string;
  accentColor: string;
}
