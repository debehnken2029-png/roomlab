--- src/components/ui/StatusBar.tsx (原始)


+++ src/components/ui/StatusBar.tsx (修改后)
import React from 'react';
import { useStore } from '../../store';

export default function StatusBar() {
  const activeTool = useStore((s: any) => s.activeTool);
  const viewMode = useStore((s: any) => s.viewMode);
  const selectedIds = useStore((s: any) => s.selectedIds);
  const gridConfig = useStore((s: any) => s.project.grid);
  const room = useStore((s: any) => s.project.room);
  const objects = useStore((s: any) => s.project.objects);
  const lastSaved = useStore((s: any) => s.lastSaved);
  const setViewMode = useStore((s: any) => s.setViewMode);
  const setGridConfig = useStore((s: any) => s.setGridConfig);
  const showShoppingList = useStore((s: any) => s.showShoppingList);
  const toggleShoppingList = useStore((s: any) => s.toggleShoppingList);
  const showHierarchy = useStore((s: any) => s.showHierarchy);
  const toggleHierarchy = useStore((s: any) => s.toggleHierarchy);

  const timeSinceSave = Math.floor((Date.now() - lastSaved) / 1000);
  const saveText = timeSinceSave < 5 ? 'Just saved' : timeSinceSave < 60 ? `Saved ${timeSinceSave}s ago` : `Saved ${Math.floor(timeSinceSave / 60)}m ago`;

  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-[#16162a] border-t border-[#2a2a3e] text-[10px] text-gray-500">
      {/* Tool */}
      <div className="flex items-center gap-1.5">
        <span className="text-indigo-400 font-medium uppercase">{activeTool}</span>
      </div>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Selection */}
      <span>{selectedIds.length > 0 ? `${selectedIds.length} selected` : 'No selection'}</span>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Room size */}
      <span>{room.width}{room.unit} × {room.length}{room.unit} × {room.height}{room.unit}</span>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Objects count */}
      <span>{objects.length} objects</span>

      <div className="flex-1" />

      {/* View controls */}
      <div className="flex items-center gap-1">
        {['orbit', 'top-down'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${viewMode === mode ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {mode === 'orbit' ? '🌐' : '⬇'} {mode}
          </button>
        ))}
      </div>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Grid */}
      <button
        onClick={() => setGridConfig({ visible: !gridConfig.visible })}
        className={`px-1.5 py-0.5 rounded transition-colors ${gridConfig.visible ? 'text-indigo-300' : 'text-gray-500'}`}
      >
        ⊞ Grid
      </button>

      {/* Snap */}
      <button
        onClick={() => setGridConfig({ snapEnabled: !gridConfig.snapEnabled })}
        className={`px-1.5 py-0.5 rounded transition-colors ${gridConfig.snapEnabled ? 'text-indigo-300' : 'text-gray-500'}`}
      >
        🧲 Snap
      </button>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Panels */}
      <button onClick={toggleHierarchy} className={`px-1.5 py-0.5 rounded transition-colors ${showHierarchy ? 'text-indigo-300' : 'text-gray-500'}`}>
        📋 Hierarchy
      </button>
      <button onClick={toggleShoppingList} className={`px-1.5 py-0.5 rounded transition-colors ${showShoppingList ? 'text-indigo-300' : 'text-gray-500'}`}>
        🛒 Shopping
      </button>

      <div className="w-px h-3 bg-[#2a2a3e]" />

      {/* Save status */}
      <span className="text-green-400/70">✓ {saveText}</span>
    </div>
  );
}
