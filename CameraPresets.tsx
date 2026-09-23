--- src/components/ui/CameraPresets.tsx (原始)


+++ src/components/ui/CameraPresets.tsx (修改后)
import React, { useState } from 'react';
import { useStore } from '../../store';

export default function CameraPresets() {
  const cameraPresets = useStore((s: any) => s.project.cameraPresets);
  const addCameraPreset = useStore((s: any) => s.addCameraPreset);
  const removeCameraPreset = useStore((s: any) => s.removeCameraPreset);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');

  const presetViews = [
    { name: 'Overview', position: [4, 3, 4] as [number, number, number], target: [0, 0.8, 0] as [number, number, number] },
    { name: 'Top Down', position: [0, 5, 0.01] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
    { name: 'Front', position: [0, 1.5, 4] as [number, number, number], target: [0, 1, 0] as [number, number, number] },
    { name: 'Corner', position: [3, 2, 3] as [number, number, number], target: [0, 0.5, 0] as [number, number, number] },
  ];

  const handleSavePreset = () => {
    if (!newName.trim()) return;
    addCameraPreset(newName, [4, 3, 4], [0, 0.8, 0]);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="px-3 py-2 border-b border-[#2a2a3e]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Camera Views</h3>
        <button onClick={() => setShowAddForm(!showAddForm)} className="text-[10px] text-indigo-400 hover:text-indigo-300">+ Save</button>
      </div>

      {showAddForm && (
        <div className="flex gap-1 mb-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="View name..."
            className="flex-1 px-2 py-1 text-[10px] bg-[#16162a] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            onKeyDown={e => e.key === 'Enter' && handleSavePreset()}
          />
          <button onClick={handleSavePreset} className="px-2 py-1 text-[10px] bg-indigo-500/20 text-indigo-300 rounded hover:bg-indigo-500/30">Save</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1">
        {presetViews.map((view, i) => (
          <button
            key={i}
            className="px-2 py-1.5 text-[10px] text-gray-400 bg-[#16162a] rounded border border-[#2a2a3e] hover:border-indigo-500/30 hover:text-indigo-300 transition-all text-left"
            title={`${view.name} view`}
          >
            <span className="text-xs mr-1">📷</span>{view.name}
          </button>
        ))}
        {cameraPresets.map((preset: any) => (
          <div key={preset.id} className="flex items-center gap-1">
            <button className="flex-1 px-2 py-1.5 text-[10px] text-gray-400 bg-[#16162a] rounded border border-[#2a2a3e] hover:border-indigo-500/30 hover:text-indigo-300 transition-all text-left truncate">
              <span className="text-xs mr-1">📌</span>{preset.name}
            </button>
            <button onClick={() => removeCameraPreset(preset.id)} className="text-gray-600 hover:text-red-400 text-[10px]">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
