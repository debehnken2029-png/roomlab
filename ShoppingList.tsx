--- src/components/ui/ShoppingList.tsx (原始)


+++ src/components/ui/ShoppingList.tsx (修改后)
import React from 'react';
import { useStore } from '../../store';

export default function ShoppingList() {
  const shoppingList = useStore((s: any) => s.project.shoppingList);
  const removeFromShoppingList = useStore((s: any) => s.removeFromShoppingList);
  const updateShoppingQuantity = useStore((s: any) => s.updateShoppingQuantity);
  const showShoppingList = useStore((s: any) => s.showShoppingList);

  if (!showShoppingList) return null;

  const total = shoppingList.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#1a1a2e] border-l border-[#2a2a3e] flex flex-col z-20 shadow-2xl">
      <div className="px-3 py-2.5 border-b border-[#2a2a3e] flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-300">🛒 Shopping List</h2>
        <span className="text-[10px] text-gray-500">{shoppingList.length} items</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {shoppingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <span className="text-2xl mb-2">🛒</span>
            <span className="text-xs">Your shopping list is empty</span>
            <span className="text-[10px] mt-1">Add furniture to see items here</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {shoppingList.map((item: any) => (
              <div key={item.productId} className="flex items-center gap-2 p-2 bg-[#16162a] rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-gray-500">${item.price.toFixed(2)} each</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateShoppingQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="w-5 h-5 rounded bg-[#2a2a3e] text-gray-400 hover:text-white text-xs flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-xs text-gray-300 w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateShoppingQuantity(item.productId, item.quantity + 1)}
                    className="w-5 h-5 rounded bg-[#2a2a3e] text-gray-400 hover:text-white text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs font-medium text-gray-300 w-14 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromShoppingList(item.productId)}
                  className="text-gray-600 hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {shoppingList.length > 0 && (
        <div className="px-3 py-3 border-t border-[#2a2a3e] bg-[#16162a]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Subtotal</span>
            <span className="text-sm font-bold text-gray-200">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Tax (est. 8%)</span>
            <span className="text-xs text-gray-400">${(total * 0.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#2a2a3e]">
            <span className="text-xs font-semibold text-gray-300">Total</span>
            <span className="text-sm font-bold text-indigo-300">${(total * 1.08).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
