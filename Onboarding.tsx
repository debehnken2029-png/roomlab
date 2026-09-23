--- src/components/ui/Onboarding.tsx (原始)


+++ src/components/ui/Onboarding.tsx (修改后)
import React, { useState } from 'react';
import { useStore } from '../../store';

const steps = [
  { title: 'Welcome to RoomLab', description: 'Design your perfect bedroom in 3D. Plan, visualize, and shop — all in one place.', icon: '🏠' },
  { title: 'Set Your Room', description: 'Define your room dimensions in the properties panel. Everything is real-world scale.', icon: '📐' },
  { title: 'Add Doors & Windows', description: 'Place doors and windows on your walls. They cut into the geometry realistically.', icon: '🪟' },
  { title: 'Add Furniture', description: 'Import from IKEA or choose from our library. Every piece is procedurally generated in 3D.', icon: '🛋' },
  { title: 'Arrange & Design', description: 'Move, rotate, and position objects precisely. Use snapping for perfect alignment.', icon: '✨' },
  { title: 'Shop & Save', description: 'Track costs with the shopping list. Save and export your designs anytime.', icon: '🛒' },
];

export default function Onboarding() {
  const showOnboarding = useStore((s: any) => s.showOnboarding);
  const dismissOnboarding = useStore((s: any) => s.dismissOnboarding);
  const [currentStep, setCurrentStep] = useState(0);

  if (!showOnboarding) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e1e2e] border border-[#2a2a3e] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="text-4xl mb-3">{step.icon}</div>
          <h2 className="text-lg font-bold text-white mb-1">{step.title}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>

        {/* Progress */}
        <div className="px-6 pb-2">
          <div className="flex gap-1.5 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-6 bg-indigo-500' : i < currentStep ? 'w-3 bg-indigo-500/50' : 'w-3 bg-[#2a2a3e]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={dismissOnboarding}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Skip tutorial
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-xs font-medium text-gray-300 bg-[#2a2a3e] rounded-lg hover:bg-[#3a3a4e] transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => isLast ? dismissOnboarding() : setCurrentStep(currentStep + 1)}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
            >
              {isLast ? 'Start Designing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
