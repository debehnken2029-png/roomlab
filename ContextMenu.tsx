--- src/components/ui/ContextMenu.tsx (原始)


+++ src/components/ui/ContextMenu.tsx (修改后)
import React from 'react';
import { useStore } from '../../store';

export default function ContextMenu() {
  const contextMenu = useStore((s: any) => s.contextMenu);
  const setContextMenu = useStore((s: any) => s.setContextMenu);
  const duplicateObject = useStore((s: any) => s.duplicateObject);
  const removeObject = useStore((s: any) => s.removeObject);
  const lockObject = useStore((s: any) => s.lockObject);
  const hideObject = useStore((s: any) => s.hideObject);
  const selectObject = useStore((s: any) => s.selectObject);
  const objects = useStore((s: any) => s.project.objects);

  if (!contextMenu) return null;

  const obj = objects.find((o: any) => o.id === contextMenu.objectId);
  if (!obj) return null;

  const handleAction = (action: string) => {
    switch (action) {
      case 'duplicate': duplicateObject(contextMenu.objectId); break;
      case 'delete': removeObject(contextMenu.objectId); break;
      case 'lock': lockObject(contextMenu.objectId); break;
      case 'hide': hideObject(contextMenu.objectId); break;
      case 'focus': selectObject(contextMenu.objectId); break;
    }
    setContextMenu(null);
  };

  const menuItems = [
    { label: 'Duplicate', shortcut: 'Ctrl+D', action: 'duplicate', icon: '⧉' },
    { label: obj.locked ? 'Unlock' : 'Lock', shortcut: '', action: 'lock', icon: obj.locked ? '🔓' : '🔒' },
    { label: obj.hidden ? 'Show' : 'Hide', shortcut: '', action: 'hide', icon: obj.hidden ? '👁' : '🚫' },
    { label: 'Focus Camera', shortcut: 'F', action: 'focus', icon: '🎯' },
    { type: 'divider' },
    { label: 'Delete', shortcut: 'Del', action: 'delete', icon: '✕', danger: true },
  ];

  return (
    <div
      className="fixed z-50 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg shadow-2xl py-1 min-w-[180px]"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1.5 border-b border-[#2a2a3e] mb-1">
        <div className="text-xs font-medium text-gray-200 truncate">{obj.name}</div>
        <div className="text-[10px] text-gray-500">{obj.product.dimensions.width}×{obj.product.dimensions.depth}×{obj.product.dimensions.height}cm</div>
      </div>
      {menuItems.map((item, i) => {
        if ('type' in item && item.type === 'divider') {
          return <div key={i} className="my-1 border-t border-[#2a2a3e]" />;
        }
        const menuItem = item as { label: string; shortcut?: string; action: string; icon: string; danger?: boolean };
        return (
          <button
            key={i}
            onClick={() => handleAction(menuItem.action)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left ${
              menuItem.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-[#2a2a3e]'
            }`}
          >
            <span className="w-4 text-center text-[10px]">{menuItem.icon}</span>
            <span className="flex-1">{menuItem.label}</span>
            {menuItem.shortcut && <span className="text-[10px] text-gray-600">{menuItem.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}
