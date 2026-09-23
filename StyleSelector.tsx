--- src/components/ui/StyleSelector.tsx (原始)


+++ src/components/ui/StyleSelector.tsx (修改后)
import React from 'react';
import { useStore } from '../../store';

const STYLES = [
  { id: 'scandinavian', name: 'Scandinavian', emoji: '🇸🇪', colors: ['#f5f0eb', '#c4a882', '#7ba3c9'] },
  { id: 'modern', name: 'Modern', emoji: '🏙', colors: ['#e8e8e8', '#8b8b8b', '#2d2d2d'] },
  { id: 'minimal', name: 'Minimal', emoji: '◻', colors: ['#ffffff', '#e0d8cf', '#333333'] },
  { id: 'cozy', name: 'Cozy', emoji: '🕯', colors: ['#f0e6d8', '#a0785a', '#c97b4b'] },
  { id: 'industrial', name: 'Industrial', emoji: '🏭', colors: ['#d0ccc8', '#6b6b6b', '#8b4513'] },
  { id: 'dark', name: 'Dark', emoji: '🌑', colors: ['#2d2d35', '#1a1a20', '#6366f1'] },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', colors: ['#1a1a2e', '#16213e', '#7c3aed'] },
];

export default function StyleSelector() {
  const currentStyle = useStore((s: any) => s.project.style);
  const applyStyle = useStore((s: any) => s.applyStyle);

  return (
    <div className="px-3 py-2 border-b border-[#2a2a3e]">
      <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Room Style</h3>
      <div className="grid grid-cols-4 gap-1">
        {STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => applyStyle(style.id)}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
              currentStyle === style.id ? 'bg-indigo-500/20 ring-1 ring-indigo-500/50' : 'hover:bg-[#2a2a3e]'
            }`}
            title={style.name}
          >
            <div className="flex gap-0.5">
              {style.colors.map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-[8px] text-gray-400 truncate w-full text-center">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
