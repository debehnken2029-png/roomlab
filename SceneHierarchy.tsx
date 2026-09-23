--- src/components/ui/SceneHierarchy.tsx (原始)


+++ src/components/ui/SceneHierarchy.tsx (修改后)
import React, { useState } from 'react';
import { useStore } from '../../store';
import type { SceneObject } from '../../types';

export default function SceneHierarchy() {
  const objects = useStore((s: any) => s.project.objects);
  const doors = useStore((s: any) => s.project.doors);
  const windows = useStore((s: any) => s.project.windows);
  const walls = useStore((s: any) => s.project.walls);
  const selectedIds = useStore((s: any) => s.selectedIds);
  const selectObject = useStore((s: any) => s.selectObject);
  const clearSelection = useStore((s: any) => s.clearSelection);
  const hideObject = useStore((s: any) => s.hideObject);
  const lockObject = useStore((s: any) => s.lockObject);
  const removeObject = useStore((s: any) => s.removeObject);

  const [expandedSections, setExpandedSections] = useState({
    room: true, walls: true, openings: true, furniture: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const furnitureObjects = objects.filter((o: SceneObject) => !['rug'].includes(o.product.category));
  const decorObjects = objects.filter((o: SceneObject) => ['rug', 'plant', 'lamp'].includes(o.product.category));

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-gray-200">
      <div className="px-3 py-2 border-b border-[#2a2a3e] flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Scene</h2>
        <span className="text-[10px] text-gray-500">{objects.length} objects</span>
      </div>
      <div className="flex-1 overflow-y-auto px-1 py-1">
        {/* Room */}
        <div className="mb-0.5">
          <button onClick={() => toggleSection('room')} className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-300 hover:bg-[#2a2a3e] rounded transition-colors">
            <span className="text-[8px]">{expandedSections.room ? '▾' : '▸'}</span>
            <span>🏠</span>
            <span className="font-medium">Room</span>
          </button>
          {expandedSections.room && (
            <div className="ml-4">
              {/* Walls */}
              <button onClick={() => toggleSection('walls')} className="w-full flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-gray-400 hover:bg-[#2a2a3e] rounded transition-colors">
                <span className="text-[8px]">{expandedSections.walls ? '▾' : '▸'}</span>
                <span>Walls ({walls.length})</span>
              </button>
              {expandedSections.walls && walls.map((w: any) => (
                <div key={w.id} className="flex items-center gap-1.5 px-2 py-0.5 ml-4 text-[10px] text-gray-500">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: w.color }}></span>
                  {w.name}
                </div>
              ))}
              {/* Openings */}
              <button onClick={() => toggleSection('openings')} className="w-full flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-gray-400 hover:bg-[#2a2a3e] rounded transition-colors">
                <span className="text-[8px]">{expandedSections.openings ? '▾' : '▸'}</span>
                <span>Openings ({doors.length + windows.length})</span>
              </button>
              {expandedSections.openings && (
                <div className="ml-4">
                  {doors.map((d: any) => (
                    <div key={d.id} className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-gray-500">
                      <span>🚪</span>{d.name}
                    </div>
                  ))}
                  {windows.map((w: any) => (
                    <div key={w.id} className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-gray-500">
                      <span>🪟</span>{w.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Furniture */}
        <div className="mb-0.5">
          <button onClick={() => toggleSection('furniture')} className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-300 hover:bg-[#2a2a3e] rounded transition-colors">
            <span className="text-[8px]">{expandedSections.furniture ? '▾' : '▸'}</span>
            <span>🪑</span>
            <span className="font-medium">Furniture ({furnitureObjects.length})</span>
          </button>
          {expandedSections.furniture && (
            <div className="ml-4">
              {furnitureObjects.map((obj: SceneObject) => (
                <div
                  key={obj.id}
                  onClick={(e) => selectObject(obj.id, e.shiftKey)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                    selectedIds.includes(obj.id) ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:bg-[#2a2a3e] hover:text-gray-200'
                  } ${obj.hidden ? 'opacity-40' : ''}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: obj.product.color }}></span>
                  <span className="flex-1 truncate">{obj.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); hideObject(obj.id); }} className="opacity-0 group-hover:opacity-100 hover:text-gray-200 text-gray-600">
                    {obj.hidden ? '◻' : '◼'}
                  </button>
                  {obj.locked && <span className="text-[8px]">🔒</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Decor */}
        {decorObjects.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-300">
              <span>✨</span>
              <span className="font-medium">Decor ({decorObjects.length})</span>
            </div>
            <div className="ml-4">
              {decorObjects.map((obj: SceneObject) => (
                <div
                  key={obj.id}
                  onClick={(e) => selectObject(obj.id, e.shiftKey)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                    selectedIds.includes(obj.id) ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:bg-[#2a2a3e] hover:text-gray-200'
                  } ${obj.hidden ? 'opacity-40' : ''}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: obj.product.color }}></span>
                  <span className="flex-1 truncate">{obj.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {objects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <span className="text-xl mb-2">📦</span>
            <span className="text-[10px]">No objects yet</span>
            <span className="text-[10px]">Add furniture from the library</span>
          </div>
        )}
      </div>
    </div>
  );
}
