--- src/components/ui/PropertiesPanel.tsx (原始)


+++ src/components/ui/PropertiesPanel.tsx (修改后)
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import type { SceneObject } from '../../types';

export default function PropertiesPanel() {
  const selectedIds = useStore((s: any) => s.selectedIds);
  const objects = useStore((s: any) => s.project.objects);
  const updateObject = useStore((s: any) => s.updateObject);
  const renameObject = useStore((s: any) => s.renameObject);
  const lockObject = useStore((s: any) => s.lockObject);
  const hideObject = useStore((s: any) => s.hideObject);
  const room = useStore((s: any) => s.project.room);
  const lighting = useStore((s: any) => s.project.lighting);
  const setLighting = useStore((s: any) => s.setLighting);
  const setRoomDimensions = useStore((s: any) => s.setRoomDimensions);
  const doors = useStore((s: any) => s.project.doors);
  const windows = useStore((s: any) => s.project.windows);
  const addDoor = useStore((s: any) => s.addDoor);
  const addWindow = useStore((s: any) => s.addWindow);

  const selectedObject: SceneObject | undefined = selectedIds.length === 1 ? objects.find((o: SceneObject) => o.id === selectedIds[0]) : undefined;

  const [roomWidth, setRoomWidth] = useState(room.width.toString());
  const [roomLength, setRoomLength] = useState(room.length.toString());
  const [roomHeight, setRoomHeight] = useState(room.height.toString());

  useEffect(() => {
    setRoomWidth(room.width.toString());
    setRoomLength(room.length.toString());
    setRoomHeight(room.height.toString());
  }, [room]);

  const handleRoomUpdate = () => {
    const w = parseFloat(roomWidth) || room.width;
    const l = parseFloat(roomLength) || room.length;
    const h = parseFloat(roomHeight) || room.height;
    setRoomDimensions(w, l, h, room.unit);
  };

  if (selectedIds.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#1a1a2e] text-gray-200">
        <div className="px-3 py-2.5 border-b border-[#2a2a3e]">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Room Settings */}
          <div>
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Room Dimensions</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-400 w-10">Width</label>
                <input type="number" value={roomWidth} onChange={e => setRoomWidth(e.target.value)} onBlur={handleRoomUpdate} className="flex-1 px-2 py-1 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none" />
                <span className="text-[10px] text-gray-500">{room.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-400 w-10">Length</label>
                <input type="number" value={roomLength} onChange={e => setRoomLength(e.target.value)} onBlur={handleRoomUpdate} className="flex-1 px-2 py-1 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none" />
                <span className="text-[10px] text-gray-500">{room.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-400 w-10">Height</label>
                <input type="number" value={roomHeight} onChange={e => setRoomHeight(e.target.value)} onBlur={handleRoomUpdate} className="flex-1 px-2 py-1 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none" />
                <span className="text-[10px] text-gray-500">{room.unit}</span>
              </div>
            </div>
          </div>

          {/* Openings */}
          <div>
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Openings</h3>
            <div className="space-y-1.5">
              <button onClick={() => addDoor('wall-south')} className="w-full px-2.5 py-1.5 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-all text-left">
                + Add Door
              </button>
              <button onClick={() => addWindow('wall-north')} className="w-full px-2.5 py-1.5 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-all text-left">
                + Add Window
              </button>
            </div>
            {doors.length > 0 && (
              <div className="mt-2 space-y-1">
                {doors.map((d: any) => (
                  <div key={d.id} className="flex items-center gap-2 px-2 py-1 bg-[#16162a] rounded text-[10px] text-gray-400">
                    <span>🚪</span><span className="flex-1 truncate">{d.name}</span>
                  </div>
                ))}
              </div>
            )}
            {windows.length > 0 && (
              <div className="mt-1 space-y-1">
                {windows.map((w: any) => (
                  <div key={w.id} className="flex items-center gap-2 px-2 py-1 bg-[#16162a] rounded text-[10px] text-gray-400">
                    <span>🪟</span><span className="flex-1 truncate">{w.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lighting */}
          <div>
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Lighting</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-gray-400">Time of Day</label>
                  <span className="text-[10px] text-gray-500">{Math.round(lighting.timeOfDay * 24)}:00</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={lighting.timeOfDay} onChange={e => setLighting({ timeOfDay: parseFloat(e.target.value) })} className="w-full h-1 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-gray-400">Ambient</label>
                  <span className="text-[10px] text-gray-500">{Math.round(lighting.ambientIntensity * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={lighting.ambientIntensity} onChange={e => setLighting({ ambientIntensity: parseFloat(e.target.value) })} className="w-full h-1 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-gray-400">Sun Intensity</label>
                  <span className="text-[10px] text-gray-500">{Math.round(lighting.sunIntensity * 100)}%</span>
                </div>
                <input type="range" min="0" max="2" step="0.01" value={lighting.sunIntensity} onChange={e => setLighting({ sunIntensity: parseFloat(e.target.value) })} className="w-full h-1 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedObject) {
    return (
      <div className="flex flex-col h-full bg-[#1a1a2e] text-gray-200">
        <div className="px-3 py-2.5 border-b border-[#2a2a3e]">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
          {selectedIds.length} objects selected
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-gray-200">
      <div className="px-3 py-2.5 border-b border-[#2a2a3e]">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Name */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Object</h3>
          <input
            type="text"
            value={selectedObject.name}
            onChange={e => renameObject(selectedObject.id, e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex gap-1 mt-1.5">
            <button onClick={() => lockObject(selectedObject.id)} className={`px-2 py-1 text-[10px] rounded ${selectedObject.locked ? 'bg-amber-500/20 text-amber-300' : 'bg-[#16162a] text-gray-400 hover:text-gray-200'}`}>
              {selectedObject.locked ? '🔒 Locked' : '🔓 Unlock'}
            </button>
            <button onClick={() => hideObject(selectedObject.id)} className={`px-2 py-1 text-[10px] rounded ${selectedObject.hidden ? 'bg-gray-500/20 text-gray-300' : 'bg-[#16162a] text-gray-400 hover:text-gray-200'}`}>
              {selectedObject.hidden ? '👁 Hidden' : '👁 Visible'}
            </button>
          </div>
        </div>

        {/* Transform */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Transform</h3>
          <div className="space-y-1.5">
            {(['X', 'Y', 'Z'] as const).map((axis, i) => (
              <div key={axis} className="flex items-center gap-2">
                <label className={`text-[10px] font-bold w-4 ${i === 0 ? 'text-red-400' : i === 1 ? 'text-green-400' : 'text-blue-400'}`}>{axis}</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedObject.position[i].toFixed(2)}
                  onChange={e => {
                    const pos = [...selectedObject.position] as [number, number, number];
                    pos[i] = parseFloat(e.target.value) || 0;
                    updateObject(selectedObject.id, { position: pos });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Rotation</h3>
          <div className="space-y-1.5">
            {(['X', 'Y', 'Z'] as const).map((axis, i) => (
              <div key={axis} className="flex items-center gap-2">
                <label className={`text-[10px] font-bold w-4 ${i === 0 ? 'text-red-400' : i === 1 ? 'text-green-400' : 'text-blue-400'}`}>{axis}</label>
                <input
                  type="number"
                  step="1"
                  value={Math.round((selectedObject.rotation[i] * 180) / Math.PI)}
                  onChange={e => {
                    const rot = [...selectedObject.rotation] as [number, number, number];
                    rot[i] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                    updateObject(selectedObject.id, { rotation: rot });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-gray-500">°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Dimensions</h3>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center px-1.5 py-1 bg-[#16162a] rounded">
              <div className="text-[10px] text-gray-500">W</div>
              <div className="text-xs text-gray-200">{selectedObject.product.dimensions.width}</div>
            </div>
            <div className="text-center px-1.5 py-1 bg-[#16162a] rounded">
              <div className="text-[10px] text-gray-500">D</div>
              <div className="text-xs text-gray-200">{selectedObject.product.dimensions.depth}</div>
            </div>
            <div className="text-center px-1.5 py-1 bg-[#16162a] rounded">
              <div className="text-[10px] text-gray-500">H</div>
              <div className="text-xs text-gray-200">{selectedObject.product.dimensions.height}</div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        {selectedObject.product.source !== 'library' && (
          <div>
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Product</h3>
            <div className="space-y-1 text-[10px]">
              {selectedObject.product.price && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="text-gray-200">${selectedObject.product.price} {selectedObject.product.currency}</span>
                </div>
              )}
              {selectedObject.product.url && (
                <a href={selectedObject.product.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  🔗 View on IKEA
                </a>
              )}
              {selectedObject.product.isApproximation && (
                <div className="flex items-center gap-1 text-amber-400/70">
                  <span>⚠</span>
                  <span>Approximated model</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
