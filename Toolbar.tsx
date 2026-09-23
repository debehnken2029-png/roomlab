--- src/components/ui/Toolbar.tsx (原始)


+++ src/components/ui/Toolbar.tsx (修改后)
import React from 'react';
import { useStore } from '../../store';
import type { Tool } from '../../types';

const tools: { id: Tool; icon: string; label: string; shortcut: string }[] = [
  { id: 'select', icon: '⊹', label: 'Select', shortcut: 'V' },
  { id: 'move', icon: '✥', label: 'Move', shortcut: 'G' },
  { id: 'rotate', icon: '↻', label: 'Rotate', shortcut: 'R' },
  { id: 'scale', icon: '⤡', label: 'Scale', shortcut: 'S' },
  { id: 'measure', icon: '⌇', label: 'Measure', shortcut: 'M' },
];

export default function Toolbar() {
  const activeTool = useStore((s: any) => s.activeTool);
  const setActiveTool = useStore((s: any) => s.setActiveTool);
  const showGrid = useStore((s: any) => s.project.grid.visible);
  const setGridConfig = useStore((s: any) => s.setGridConfig);
  const undo = useStore((s: any) => s.undo);
  const redo = useStore((s: any) => s.redo);
  const saveProject = useStore((s: any) => s.saveProject);
  const presentationMode = useStore((s: any) => s.presentationMode);
  const togglePresentationMode = useStore((s: any) => s.togglePresentationMode);
  const deleteSelected = useStore((s: any) => s.deleteSelected);
  const duplicateSelected = useStore((s: any) => s.duplicateSelected);
  const selectedIds = useStore((s: any) => s.selectedIds);

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1e1e2e] border-b border-[#2a2a3e]">
      {/* Tools */}
      <div className="flex items-center gap-0.5 bg-[#16162a] rounded-lg p-0.5">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`relative px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              activeTool === tool.id
                ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a4a]'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <span className="text-base">{tool.icon}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-[#2a2a3e] mx-2" />

      {/* Grid toggle */}
      <button
        onClick={() => setGridConfig({ visible: !showGrid })}
        className={`px-2.5 py-1.5 rounded-md text-sm transition-all ${showGrid ? 'text-indigo-400 bg-[#2a2a4a]' : 'text-gray-500 hover:text-gray-300'}`}
        title="Toggle Grid"
      >
        ⊞
      </button>

      <div className="w-px h-6 bg-[#2a2a3e] mx-2" />

      {/* Actions */}
      <button onClick={undo} className="px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-[#2a2a4a] transition-all" title="Undo (Ctrl+Z)">↶</button>
      <button onClick={redo} className="px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-[#2a2a4a] transition-all" title="Redo (Ctrl+Shift+Z)">↷</button>

      {selectedIds.length > 0 && (
        <>
          <div className="w-px h-6 bg-[#2a2a3e] mx-2" />
          <button onClick={duplicateSelected} className="px-2 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-[#2a2a4a] transition-all" title="Duplicate (Ctrl+D)">⧉</button>
          <button onClick={deleteSelected} className="px-2 py-1.5 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all" title="Delete (Del)">✕</button>
        </>
      )}

      <div className="flex-1" />

      {/* Right side */}
      <button onClick={saveProject} className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-300 hover:text-white hover:bg-[#2a2a4a] transition-all" title="Save (Ctrl+S)">
        💾 Save
      </button>
      <button onClick={togglePresentationMode} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${presentationMode ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-[#2a2a4a]'}`}>
        🎬 Present
      </button>
    </div>
  );
}
