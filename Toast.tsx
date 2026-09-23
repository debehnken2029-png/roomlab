--- src/components/ui/Toast.tsx (原始)


+++ src/components/ui/Toast.tsx (修改后)
import React, { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
  const toast: Toast = { id: Math.random().toString(36), message, type, duration };
  toastListeners.forEach(listener => listener(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, toast.duration || 3000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter(l => l !== addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg text-xs font-medium shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            toast.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }`}
        >
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'} {toast.message}
        </div>
      ))}
    </div>
  );
}
