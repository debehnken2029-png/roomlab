--- src/App.tsx (原始)
export default function App() {
  return (
    <div/>
  );
}


+++ src/App.tsx (修改后)
import React, { useEffect, useCallback, useState } from 'react';
import Scene from './components/viewport/Scene';
import Toolbar from './components/ui/Toolbar';
import AssetLibrary from './components/ui/AssetLibrary';
import PropertiesPanel from './components/ui/PropertiesPanel';
import SceneHierarchy from './components/ui/SceneHierarchy';
import StatusBar from './components/ui/StatusBar';
import ShoppingList from './components/ui/ShoppingList';
import Onboarding from './components/ui/Onboarding';
import ContextMenu from './components/ui/ContextMenu';
import StyleSelector from './components/ui/StyleSelector';
import CameraPresets from './components/ui/CameraPresets';
import ToastContainer, { showToast } from './components/ui/Toast';
import { useStore } from './store';

export default function App() {
  const [leftPanel, setLeftPanel] = useState<'library' | 'hierarchy'>('library');
  const activeTool = useStore((s: any) => s.activeTool);
  const presentationMode = useStore((s: any) => s.presentationMode);
  const showHierarchy = useStore((s: any) => s.showHierarchy);
  const showShoppingList = useStore((s: any) => s.showShoppingList);
  const deleteSelected = useStore((s: any) => s.deleteSelected);
  const duplicateSelected = useStore((s: any) => s.duplicateSelected);
  const saveProject = useStore((s: any) => s.saveProject);
  const setActiveTool = useStore((s: any) => s.setActiveTool);
  const exportProject = useStore((s: any) => s.exportProject);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't intercept when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      // undo
    } else if (ctrl && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      // redo
    } else if (ctrl && e.key === 's') {
      e.preventDefault();
      saveProject();
    } else if (ctrl && e.key === 'd') {
      e.preventDefault();
      duplicateSelected();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!ctrl) {
        e.preventDefault();
        deleteSelected();
      }
    } else if (e.key === 'v' || e.key === 'V') {
      setActiveTool('select');
    } else if (e.key === 'g' || e.key === 'G') {
      setActiveTool('move');
    } else if (e.key === 'r' || e.key === 'R') {
      setActiveTool('rotate');
    } else if (e.key === 's' && !ctrl) {
      setActiveTool('scale');
    } else if (e.key === 'm' || e.key === 'M') {
      setActiveTool('measure');
    } else if (e.key === 'Escape') {
      // Clear selection
      useStore.getState().clearSelection();
    }
  }, [deleteSelected, duplicateSelected, saveProject, setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Autosave
  useEffect(() => {
    const interval = setInterval(() => {
      saveProject();
    }, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [saveProject]);

  // Handle export
  const handleExport = useCallback(() => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roomlab-project.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Project exported successfully', 'success');
  }, [exportProject]);

  if (presentationMode) {
    return (
      <div className="w-full h-screen relative bg-[#1a1a2e]">
        <Scene />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => useStore.getState().togglePresentationMode()}
            className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg border border-white/10 hover:bg-black/70 transition-colors"
          >
            ✕ Exit Presentation
          </button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-white/60 text-xs">🎬 Presentation Mode</span>
            <button onClick={handleExport} className="text-white/60 text-xs hover:text-white transition-colors">📸 Screenshot</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#12121e] overflow-hidden select-none">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-2 bg-[#16162a] border-b border-[#2a2a3e]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">R</div>
          <span className="text-sm font-semibold text-white">RoomLab</span>
          <span className="text-[10px] text-gray-500 bg-[#2a2a3e] px-1.5 py-0.5 rounded">3D Planner</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button onClick={handleExport} className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-[#2a2a3e] rounded transition-colors" title="Export Project">
            📤 Export
          </button>
          <label className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-[#2a2a3e] rounded transition-colors cursor-pointer" title="Import Project">
            📥 Import
            <input type="file" accept=".json" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const json = ev.target?.result as string;
                    useStore.getState().importProject(json);
                    showToast('Project imported successfully', 'success');
                  } catch {
                    showToast('Failed to import project. Invalid file.', 'error');
                  }
                };
                reader.readAsText(file);
              }
            }} />
          </label>
          <button onClick={() => useStore.getState().togglePresentationMode()} className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-[#2a2a3e] rounded transition-colors" title="Presentation Mode">
            🎬 Present
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel */}
        <div className="w-64 flex flex-col border-r border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden">
          {/* Panel Tabs */}
          <div className="flex border-b border-[#2a2a3e]">
            <button
              onClick={() => setLeftPanel('library')}
              className={`flex-1 px-3 py-2 text-[10px] font-medium transition-colors ${leftPanel === 'library' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-[#16162a]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              📦 Library
            </button>
            <button
              onClick={() => setLeftPanel('hierarchy')}
              className={`flex-1 px-3 py-2 text-[10px] font-medium transition-colors ${leftPanel === 'hierarchy' ? 'text-indigo-300 border-b-2 border-indigo-500 bg-[#16162a]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              📋 Scene
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {leftPanel === 'library' ? <AssetLibrary /> : <SceneHierarchy />}
          </div>

          {/* Style Selector & Camera */}
          {leftPanel === 'library' && (
            <>
              <StyleSelector />
              <CameraPresets />
            </>
          )}
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Scene />

          {/* Viewport overlay info */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-2 py-1 bg-black/30 backdrop-blur-sm rounded text-[10px] text-gray-400">
              <span>🎥 Orbit</span>
              <span>•</span>
              <span>Scroll to zoom</span>
              <span>•</span>
              <span>Right-click for options</span>
            </div>
          </div>

          {/* Measurement mode indicator */}
          {activeTool === 'measure' && (
            <div className="absolute top-12 left-3 z-10 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm rounded text-[10px] text-amber-300">
                <span>⌇</span>
                <span>Click two points to measure distance</span>
              </div>
            </div>
          )}

          {/* Screenshot button */}
          <div className="absolute bottom-3 right-3 z-10">
            <button
              onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  const link = document.createElement('a');
                  link.download = 'roomlab-screenshot.png';
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                  showToast('Screenshot saved', 'success');
                }
              }}
              className="px-3 py-1.5 bg-black/40 backdrop-blur-sm text-white/70 text-[10px] rounded-lg border border-white/10 hover:bg-black/60 hover:text-white transition-all"
              title="Take Screenshot"
            >
              📸 Screenshot
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-60 border-l border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden">
          <PropertiesPanel />
        </div>

        {/* Shopping List Overlay */}
        {showShoppingList && <ShoppingList />}
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Context Menu */}
      <ContextMenu />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Onboarding */}
      <Onboarding />
    </div>
  );
}

