--- src/components/viewport/Scene.tsx (原始)


+++ src/components/viewport/Scene.tsx (修改后)
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, ContactShadows, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';
import { generateProceduralModel } from '../../utils/proceduralFurniture';
import { Vector3Tuple } from 'three';
import type { SceneObject, DoorConfig, WindowConfig, Measurement, WallConfig } from '../../types';

const cm2m = (cm: number) => cm / 100;

function Room() {
  const room = useStore((s: any) => s.project.room);
  const walls = useStore((s: any) => s.project.walls);
  const doors = useStore((s: any) => s.project.doors);
  const windows = useStore((s: any) => s.project.windows);
  const style = useStore((s: any) => s.project.style);

  const w = cm2m(room.width);
  const l = cm2m(room.length);
  const h = cm2m(room.height);

  const floorColor = useMemo(() => {
    const styles: Record<string, string> = {
      scandinavian: '#c4a882', modern: '#8b8b8b', minimal: '#e0d8cf',
      cozy: '#a0785a', industrial: '#6b6b6b', dark: '#1a1a20', gaming: '#16213e',
    };
    return styles[style] || '#c4a882';
  }, [style]);

  const ceilingColor = useMemo(() => {
    const styles: Record<string, string> = {
      scandinavian: '#ffffff', modern: '#ffffff', minimal: '#ffffff',
      cozy: '#f5ede5', industrial: '#c0c0c0', dark: '#252530', gaming: '#0f0f1a',
    };
    return styles[style] || '#ffffff';
  }, [style]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} />
      </mesh>
      <WallMesh wall={walls[0]} width={w} height={h} position={[0, h / 2, -l / 2]} rotation={[0, 0, 0]} doors={doors.filter((d: DoorConfig) => d.wallId === walls[0]?.id)} windows={windows.filter((win: WindowConfig) => win.wallId === walls[0]?.id)} />
      <WallMesh wall={walls[1]} width={w} height={h} position={[0, h / 2, l / 2]} rotation={[0, Math.PI, 0]} doors={doors.filter((d: DoorConfig) => d.wallId === walls[1]?.id)} windows={windows.filter((win: WindowConfig) => win.wallId === walls[1]?.id)} />
      <WallMesh wall={walls[2]} width={l} height={h} position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} doors={doors.filter((d: DoorConfig) => d.wallId === walls[2]?.id)} windows={windows.filter((win: WindowConfig) => win.wallId === walls[2]?.id)} />
      <WallMesh wall={walls[3]} width={l} height={h} position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} doors={doors.filter((d: DoorConfig) => d.wallId === walls[3]?.id)} windows={windows.filter((win: WindowConfig) => win.wallId === walls[3]?.id)} />
      <Baseboard w={w} l={l} />
    </group>
  );
}

function Baseboard({ w, l }: { w: number; l: number }) {
  const bh = 0.08;
  const bd = 0.015;
  return (
    <group>
      <mesh position={[0, bh / 2, -l / 2 + bd / 2]}><boxGeometry args={[w, bh, bd]} /><meshStandardMaterial color="#e8e0d8" roughness={0.6} /></mesh>
      <mesh position={[0, bh / 2, l / 2 - bd / 2]}><boxGeometry args={[w, bh, bd]} /><meshStandardMaterial color="#e8e0d8" roughness={0.6} /></mesh>
      <mesh position={[w / 2 - bd / 2, bh / 2, 0]}><boxGeometry args={[bd, bh, l]} /><meshStandardMaterial color="#e8e0d8" roughness={0.6} /></mesh>
      <mesh position={[-w / 2 + bd / 2, bh / 2, 0]}><boxGeometry args={[bd, bh, l]} /><meshStandardMaterial color="#e8e0d8" roughness={0.6} /></mesh>
    </group>
  );
}

function WallMesh({ wall, width, height, position, rotation, doors, windows }: {
  wall: WallConfig; width: number; height: number; position: Vector3Tuple; rotation: Vector3Tuple;
  doors: DoorConfig[]; windows: WindowConfig[];
}) {
  if (!wall) return null;

  const wallParts = useMemo(() => {
    const parts: { pos: Vector3Tuple; size: Vector3Tuple }[] = [];
    const openings = [
      ...doors.map((d: DoorConfig) => ({ pos: d.position * width - width / 2, w: cm2m(d.width), h: cm2m(d.height), bottom: 0 })),
      ...windows.map((w: WindowConfig) => ({ pos: w.position * width - width / 2, w: cm2m(w.width), h: cm2m(w.height), bottom: cm2m(w.sillHeight) })),
    ].sort((a, b) => a.pos - b.pos);

    if (openings.length === 0) {
      parts.push({ pos: [0, 0, 0], size: [width, height, 0.15] });
    } else {
      let currentX = -width / 2;
      for (const opening of openings) {
        const openLeft = opening.pos - opening.w / 2;
        const openRight = opening.pos + opening.w / 2;
        const openBottom = opening.bottom;
        const openTop = opening.bottom + opening.h;

        if (openLeft > currentX + 0.01) {
          const segW = openLeft - currentX;
          parts.push({ pos: [currentX + segW / 2, 0, 0], size: [segW, height, 0.15] });
        }
        if (openTop < height - 0.01) {
          const aboveH = height - openTop;
          parts.push({ pos: [opening.pos, height / 2 - aboveH / 2, 0], size: [opening.w, aboveH, 0.15] });
        }
        if (openBottom > 0.01) {
          parts.push({ pos: [opening.pos, -height / 2 + openBottom / 2, 0], size: [opening.w, openBottom, 0.15] });
        }
        currentX = openRight;
      }
      if (currentX < width / 2 - 0.01) {
        const segW = width / 2 - currentX;
        parts.push({ pos: [currentX + segW / 2, 0, 0], size: [segW, height, 0.15] });
      }
    }
    return parts;
  }, [wall, width, height, doors, windows]);

  return (
    <group position={position} rotation={rotation}>
      {wallParts.map((part: any, i: number) => (
        <mesh key={i} position={part.pos} castShadow receiveShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={wall.color} roughness={0.85} />
        </mesh>
      ))}
      {doors.map((door: DoorConfig) => (
        <DoorMesh key={door.id} door={door} wallWidth={width} wallHeight={height} />
      ))}
      {windows.map((win: WindowConfig) => (
        <WindowMesh key={win.id} window={win} wallWidth={width} wallHeight={height} />
      ))}
    </group>
  );
}

function DoorMesh({ door, wallWidth, wallHeight }: { door: DoorConfig; wallWidth: number; wallHeight: number }) {
  const dw = cm2m(door.width);
  const dh = cm2m(door.height);
  const dx = door.position * wallWidth - wallWidth / 2;

  return (
    <group position={[dx, -wallHeight / 2 + dh / 2, 0.02]}>
      <mesh castShadow>
        <boxGeometry args={[dw - 0.02, dh - 0.02, 0.04]} />
        <meshStandardMaterial color={door.color} roughness={0.6} />
      </mesh>
      <mesh position={[0, dh * 0.15, 0.025]}>
        <boxGeometry args={[dw * 0.7, dh * 0.3, 0.01]} />
        <meshStandardMaterial color={door.color} roughness={0.5} />
      </mesh>
      <mesh position={[0, -dh * 0.2, 0.025]}>
        <boxGeometry args={[dw * 0.7, dh * 0.3, 0.01]} />
        <meshStandardMaterial color={door.color} roughness={0.5} />
      </mesh>
      <mesh position={[dw * 0.35, 0, 0.04]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-dw / 2, 0, 0]}>
        <boxGeometry args={[0.04, dh, 0.08]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.6} />
      </mesh>
      <mesh position={[dw / 2, 0, 0]}>
        <boxGeometry args={[0.04, dh, 0.08]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.6} />
      </mesh>
      <mesh position={[0, dh / 2, 0]}>
        <boxGeometry args={[dw + 0.04, 0.04, 0.08]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.6} />
      </mesh>
    </group>
  );
}

function WindowMesh({ window: win, wallWidth, wallHeight }: { window: WindowConfig; wallWidth: number; wallHeight: number }) {
  const ww = cm2m(win.width);
  const wh = cm2m(win.height);
  const wx = win.position * wallWidth - wallWidth / 2;
  const wy = -wallHeight / 2 + cm2m(win.sillHeight) + wh / 2;

  return (
    <group position={[wx, wy, 0]}>
      <mesh>
        <boxGeometry args={[ww - 0.06, wh - 0.06, 0.01]} />
        <meshStandardMaterial color={win.glassColor} transparent opacity={0.3} roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[-ww / 2 + 0.015, 0, 0]}>
        <boxGeometry args={[0.03, wh, 0.06]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[ww / 2 - 0.015, 0, 0]}>
        <boxGeometry args={[0.03, wh, 0.06]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, wh / 2 - 0.015, 0]}>
        <boxGeometry args={[ww, 0.03, 0.06]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, -wh / 2 + 0.015, 0]}>
        <boxGeometry args={[ww, 0.03, 0.06]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[ww - 0.06, 0.02, 0.02]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.02, wh - 0.06, 0.02]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, -wh / 2 - 0.02, 0.04]}>
        <boxGeometry args={[ww + 0.06, 0.03, 0.1]} />
        <meshStandardMaterial color={win.frameColor} roughness={0.5} />
      </mesh>
    </group>
  );
}

function FurnitureItem({ object }: { object: SceneObject }) {
  const selectedIds = useStore((s: any) => s.selectedIds);
  const selectObject = useStore((s: any) => s.selectObject);
  const setContextMenu = useStore((s: any) => s.setContextMenu);
  const isSelected = selectedIds.includes(object.id);

  const model = useMemo(() => {
    return generateProceduralModel(object.product.category, object.product.dimensions, object.product.color);
  }, [object.product]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    selectObject(object.id, e.shiftKey);
  }, [object.id, selectObject]);

  const handleContextMenu = useCallback((e: any) => {
    e.stopPropagation();
    const event = e.nativeEvent || e;
    setContextMenu({ x: event.clientX || event.pageX || 0, y: event.clientY || event.pageY || 0, objectId: object.id });
  }, [object.id, setContextMenu]);

  if (object.hidden) return null;

  return (
    <group position={object.position} rotation={object.rotation} scale={object.scale} onClick={handleClick} onContextMenu={handleContextMenu}>
      {model.parts.map((part, i) => {
        const props = {
          key: i,
          position: part.position as Vector3Tuple,
          rotation: (part.rotation || [0, 0, 0]) as Vector3Tuple,
          castShadow: true,
          receiveShadow: true,
        };
        let geometry;
        switch (part.shape) {
          case 'cylinder': geometry = <cylinderGeometry args={[part.size[0] / 2, part.size[1] / 2, part.size[2], 16]} />; break;
          case 'sphere': geometry = <sphereGeometry args={[part.size[0] / 2, 16, 16]} />; break;
          case 'plane': geometry = <planeGeometry args={[part.size[0], part.size[1]]} />; break;
          default: geometry = <boxGeometry args={part.size} />;
        }
        return (
          <mesh {...props}>
            {geometry}
            <meshStandardMaterial color={part.color} roughness={part.roughness ?? 0.5} metalness={part.metalness ?? 0} transparent={(part.opacity ?? 1) < 1} opacity={part.opacity ?? 1} />
          </mesh>
        );
      })}
      {isSelected && (
        <mesh position={[0, (object.product.dimensions.height / 100) / 2, 0]}>
          <boxGeometry args={[object.product.dimensions.width / 100 + 0.02, object.product.dimensions.height / 100 + 0.02, object.product.dimensions.depth / 100 + 0.02]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function TransformControlsWrapper() {
  const selectedIds = useStore((s: any) => s.selectedIds);
  const activeTool = useStore((s: any) => s.activeTool);
  const updateObject = useStore((s: any) => s.updateObject);
  const controlsRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const selectedObject = useStore((s: any) => s.project.objects.find((o: SceneObject) => o.id === selectedIds[0]));

  const mode = activeTool === 'rotate' ? 'rotate' : activeTool === 'scale' ? 'scale' : 'translate';

  useEffect(() => {
    if (controlsRef.current) {
      const callback = () => {
        if (!meshRef.current || !selectedObject) return;
        const pos = meshRef.current.position;
        const rot = meshRef.current.rotation;
        const scale = meshRef.current.scale;
        updateObject(selectedObject.id, {
          position: [pos.x, pos.y, pos.z] as Vector3Tuple,
          rotation: [rot.x, rot.y, rot.z] as Vector3Tuple,
          scale: [scale.x, scale.y, scale.z] as Vector3Tuple,
        });
      };
      const ctrl = controlsRef.current;
      ctrl.addEventListener('change', callback);
      ctrl.addEventListener('mouseUp', callback);
      return () => {
        ctrl.removeEventListener('change', callback);
        ctrl.removeEventListener('mouseUp', callback);
      };
    }
  }, [selectedObject, updateObject]);

  if (!selectedObject || selectedIds.length !== 1 || activeTool === 'select' || activeTool === 'measure') return null;

  return (
    <TransformControls ref={controlsRef} object={meshRef as any} mode={mode} translationSnap={0.05} rotationSnap={Math.PI / 12} scaleSnap={0.1}>
      <group ref={meshRef} position={selectedObject.position} rotation={selectedObject.rotation} scale={selectedObject.scale}>
        <mesh visible={false}><boxGeometry args={[0.01, 0.01, 0.01]} /><meshBasicMaterial /></mesh>
      </group>
    </TransformControls>
  );
}

function MeasurementsOverlay() {
  const measurements = useStore((s: any) => s.project.measurements);
  return (
    <group>
      {measurements.map((m: Measurement) => <MeasurementLine key={m.id} measurement={m} />)}
    </group>
  );
}

function MeasurementLine({ measurement }: { measurement: Measurement }) {
  const start = new THREE.Vector3(...measurement.start);
  const end = new THREE.Vector3(...measurement.end);
  const distance = start.distanceTo(end);
  const mid = start.clone().add(end).divideScalar(2);

  let displayValue: string;
  switch (measurement.unit) {
    case 'cm': displayValue = `${(distance * 100).toFixed(1)} cm`; break;
    case 'm': displayValue = `${distance.toFixed(2)} m`; break;
    case 'in': displayValue = `${(distance * 39.37).toFixed(1)} in`; break;
    case 'ft': displayValue = `${(distance * 3.281).toFixed(2)} ft`; break;
    default: displayValue = `${distance.toFixed(2)} m`;
  }

  return (
    <group>
      <Line points={[measurement.start, measurement.end]} color="#f59e0b" lineWidth={2} />
      <mesh position={measurement.start}><sphereGeometry args={[0.02, 8, 8]} /><meshBasicMaterial color="#f59e0b" /></mesh>
      <mesh position={measurement.end}><sphereGeometry args={[0.02, 8, 8]} /><meshBasicMaterial color="#f59e0b" /></mesh>
      <Html position={[mid.x, mid.y + 0.1, mid.z]} center>
        <div style={{ background: 'rgba(0,0,0,0.85)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'nowrap', pointerEvents: 'none', border: '1px solid rgba(245,158,11,0.3)' }}>
          {displayValue}
        </div>
      </Html>
    </group>
  );
}

function LightingSystem() {
  const lighting = useStore((s: any) => s.project.lighting);
  const sunAngle = lighting.timeOfDay * Math.PI;
  const sunX = Math.cos(sunAngle) * 5;
  const sunY = Math.sin(sunAngle) * 5;

  return (
    <>
      <ambientLight intensity={lighting.ambientIntensity} color="#fff5e6" />
      <directionalLight position={[sunX, Math.max(sunY, 0.5), 2]} intensity={lighting.sunIntensity} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={20} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0001} color="#fff8f0" />
      <pointLight position={[0, 2.2, 0]} intensity={0.3} color="#fff5e0" distance={6} />
      <hemisphereLight intensity={0.2} groundColor="#4a3728" color="#87ceeb" />
    </>
  );
}

function SceneGrid() {
  const gridConfig = useStore((s: any) => s.project.grid);
  const room = useStore((s: any) => s.project.room);
  if (!gridConfig.visible) return null;
  const size = Math.max(cm2m(room.width), cm2m(room.length)) + 2;
  return (
    <Grid args={[size, size]} position={[0, 0.001, 0]} cellSize={gridConfig.snapSize} cellThickness={0.5} cellColor="#444466" sectionSize={0.5} sectionThickness={1} sectionColor="#666688" fadeDistance={10} infiniteGrid={false} />
  );
}

function FloorClickHandler() {
  const clearSelection = useStore((s: any) => s.clearSelection);
  const setContextMenu = useStore((s: any) => s.setContextMenu);
  const activeTool = useStore((s: any) => s.activeTool);
  const addMeasurement = useStore((s: any) => s.addMeasurement);
  const room = useStore((s: any) => s.project.room);
  const [measurePoints, setMeasurePoints] = useState<Vector3Tuple[]>([]);
  const w = cm2m(room.width);
  const l = cm2m(room.length);

  const handleClick = useCallback((e: any) => {
    if (activeTool === 'measure' && e.point) {
      const point: Vector3Tuple = [e.point.x, e.point.y, e.point.z];
      setMeasurePoints(prev => {
        const newPoints = [...prev, point];
        if (newPoints.length === 2) {
          addMeasurement(newPoints[0], newPoints[1]);
          return [];
        }
        return newPoints;
      });
    } else {
      clearSelection();
      setContextMenu(null);
    }
  }, [activeTool, clearSelection, setContextMenu, addMeasurement]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0001, 0]} onClick={handleClick}>
        <planeGeometry args={[w, l]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Measurement preview line */}
      {measurePoints.length === 1 && activeTool === 'measure' && (
        <mesh position={measurePoints[0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function Scene() {
  const objects = useStore((s: any) => s.project.objects);
  const setContextMenu = useStore((s: any) => s.setContextMenu);

  return (
    <Canvas shadows camera={{ position: [4, 3, 4], fov: 50, near: 0.1, far: 100 }} onPointerMissed={() => setContextMenu(null)} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }} style={{ background: '#1a1a2e' }}>
      <LightingSystem />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={0.5} maxDistance={15} maxPolarAngle={Math.PI * 0.85} target={[0, 0.8, 0]} />
      <Room />
      <SceneGrid />
      <FloorClickHandler />
      {objects.map((obj: SceneObject) => <FurnitureItem key={obj.id} object={obj} />)}
      <TransformControlsWrapper />
      <MeasurementsOverlay />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <fog attach="fog" args={['#1a1a2e', 10, 25]} />
    </Canvas>
  );
}
