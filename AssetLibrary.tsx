--- src/components/ui/AssetLibrary.tsx (原始)


+++ src/components/ui/AssetLibrary.tsx (修改后)
import React, { useState } from 'react';
import { useStore } from '../../store';
import type { ProductData, FurnitureCategory } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const PRESET_FURNITURE: { name: string; category: FurnitureCategory; dimensions: { width: number; depth: number; height: number }; color: string; price: number }[] = [
  { name: 'Single Bed', category: 'bed', dimensions: { width: 90, depth: 200, height: 75 }, color: '#f5f0eb', price: 199 },
  { name: 'Double Bed', category: 'bed', dimensions: { width: 140, depth: 200, height: 85 }, color: '#f5f0eb', price: 299 },
  { name: 'Queen Bed', category: 'bed', dimensions: { width: 160, depth: 210, height: 90 }, color: '#f5f0eb', price: 349 },
  { name: 'Office Desk', category: 'desk', dimensions: { width: 120, depth: 60, height: 75 }, color: '#ffffff', price: 179 },
  { name: 'Small Desk', category: 'desk', dimensions: { width: 80, depth: 50, height: 73 }, color: '#c4a882', price: 99 },
  { name: 'Office Chair', category: 'chair', dimensions: { width: 62, depth: 60, height: 110 }, color: '#333333', price: 249 },
  { name: 'Dining Chair', category: 'chair', dimensions: { width: 45, depth: 50, height: 85 }, color: '#c4a882', price: 69 },
  { name: '6-Drawer Dresser', category: 'dresser', dimensions: { width: 160, depth: 48, height: 78 }, color: '#f5f0eb', price: 199 },
  { name: '3-Drawer Dresser', category: 'dresser', dimensions: { width: 70, depth: 48, height: 78 }, color: '#f5f0eb', price: 129 },
  { name: 'Nightstand', category: 'nightstand', dimensions: { width: 48, depth: 40, height: 55 }, color: '#f5f0eb', price: 79 },
  { name: 'Bookshelf', category: 'bookshelf', dimensions: { width: 80, depth: 28, height: 202 }, color: '#f5f0eb', price: 99 },
  { name: 'Wardrobe', category: 'wardrobe', dimensions: { width: 150, depth: 58, height: 201 }, color: '#f5f0eb', price: 299 },
  { name: 'Floor Lamp', category: 'lamp', dimensions: { width: 28, depth: 28, height: 160 }, color: '#333333', price: 49 },
  { name: 'Table Lamp', category: 'lamp', dimensions: { width: 20, depth: 20, height: 45 }, color: '#c4a882', price: 29 },
  { name: 'Indoor Plant', category: 'plant', dimensions: { width: 30, depth: 30, height: 80 }, color: '#4a7c59', price: 19 },
  { name: 'Area Rug', category: 'rug', dimensions: { width: 200, depth: 150, height: 2 }, color: '#c4b5a0', price: 99 },
  { name: 'Small Rug', category: 'rug', dimensions: { width: 120, depth: 80, height: 2 }, color: '#8b7355', price: 49 },
  { name: 'Monitor', category: 'monitor', dimensions: { width: 55, depth: 20, height: 45 }, color: '#1a1a1a', price: 199 },
  { name: 'Sofa', category: 'sofa', dimensions: { width: 180, depth: 85, height: 80 }, color: '#6b7280', price: 399 },
  { name: 'Coffee Table', category: 'table', dimensions: { width: 90, depth: 55, height: 45 }, color: '#c4a882', price: 89 },
  { name: 'Side Table', category: 'table', dimensions: { width: 45, depth: 45, height: 55 }, color: '#333333', price: 49 },
];

const CATEGORIES: { id: FurnitureCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bed', label: '🛏 Beds' },
  { id: 'desk', label: '🖥 Desks' },
  { id: 'chair', label: '🪑 Chairs' },
  { id: 'dresser', label: '🗄 Dressers' },
  { id: 'nightstand', label: '🔲 Nightstands' },
  { id: 'bookshelf', label: '📚 Bookshelves' },
  { id: 'wardrobe', label: '👔 Wardrobes' },
  { id: 'lamp', label: '💡 Lamps' },
  { id: 'plant', label: '🌿 Plants' },
  { id: 'rug', label: '🟫 Rugs' },
  { id: 'monitor', label: '🖥 Monitors' },
  { id: 'sofa', label: '🛋 Sofas' },
  { id: 'table', label: '🪑 Tables' },
];

export default function AssetLibrary() {
  const addObject = useStore((s: any) => s.addObject);
  const addToShoppingList = useStore((s: any) => s.addToShoppingList);
  const [ikeaUrl, setIkeaUrl] = useState('');
  const [activeCategory, setActiveCategory] = useState<FurnitureCategory | 'all'>('all');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualProduct, setManualProduct] = useState({
    name: '', width: '', depth: '', height: '', color: '#f5f0eb', price: '', category: 'custom' as FurnitureCategory,
  });

  const filteredFurniture = activeCategory === 'all'
    ? PRESET_FURNITURE
    : PRESET_FURNITURE.filter(f => f.category === activeCategory);

  const handleAddPreset = (preset: typeof PRESET_FURNITURE[0]) => {
    const product: ProductData = {
      id: uuidv4(),
      name: preset.name,
      price: preset.price,
      currency: 'USD',
      category: preset.category,
      dimensions: preset.dimensions,
      color: preset.color,
      materials: ['particleboard'],
      source: 'library',
      isApproximation: true,
    };
    addObject(product, [0, 0, 0]);
    addToShoppingList(product.id, product.name, product.price || 0, product.currency);
  };

  const handleIkeaImport = () => {
    if (!ikeaUrl.trim()) return;

    // Validate URL
    try {
      const url = new URL(ikeaUrl);
      if (!url.hostname.includes('ikea.com')) {
        // Not an IKEA URL, still allow as custom import
      }
    } catch {
      // Invalid URL, treat as custom
    }

    // Try to extract product info from URL
    let name = 'IKEA Product';
    let category: FurnitureCategory = 'custom';

    // Attempt to parse IKEA URL for product name
    const urlParts = ikeaUrl.split('/');
    const productSlug = urlParts.find(p => p.includes('-') && p.length > 3);
    if (productSlug) {
      name = productSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).split('_')[0];
    }

    // Guess category from name
    const nameLower = name.toLowerCase();
    if (nameLower.includes('bed') || nameLower.includes('malm') || nameLower.includes('hemnes')) category = 'bed';
    else if (nameLower.includes('desk') || nameLower.includes('micke') || nameLower.includes('bekant')) category = 'desk';
    else if (nameLower.includes('chair') || nameLower.includes('markus') || nameLower.includes('renberget')) category = 'chair';
    else if (nameLower.includes('dresser') || nameLower.includes('malm')) category = 'dresser';
    else if (nameLower.includes('shelf') || nameLower.includes('billy') || nameLower.includes('kallax')) category = 'bookshelf';
    else if (nameLower.includes('lamp') || nameLower.includes('hektar') || nameLower.includes('tertiar')) category = 'lamp';
    else if (nameLower.includes('table') || nameLower.includes('lack') || nameLower.includes('linnmon')) category = 'table';
    else if (nameLower.includes('sofa') || nameLower.includes('kivik') || nameLower.includes('landskrona')) category = 'sofa';
    else if (nameLower.includes('nightstand') || nameLower.includes('hemnes')) category = 'nightstand';

    const product: ProductData = {
      id: uuidv4(),
      name: name,
      url: ikeaUrl,
      price: 0,
      currency: 'USD',
      category: category,
      dimensions: { width: 100, depth: 60, height: 75 },
      color: '#f5f0eb',
      materials: ['particleboard'],
      source: 'ikea',
      isApproximation: true,
    };
    addObject(product, [0, 0, 0]);
    setIkeaUrl('');
    // Show manual form to let user adjust dimensions
    setManualProduct({
      name: product.name,
      width: '100',
      depth: '60',
      height: '75',
      color: '#f5f0eb',
      price: '',
      category: category,
    });
    setShowManualForm(true);
  };

  const handleManualAdd = () => {
    if (!manualProduct.name) return;
    const product: ProductData = {
      id: uuidv4(),
      name: manualProduct.name,
      price: parseFloat(manualProduct.price) || 0,
      currency: 'USD',
      category: manualProduct.category,
      dimensions: {
        width: parseFloat(manualProduct.width) || 100,
        depth: parseFloat(manualProduct.depth) || 60,
        height: parseFloat(manualProduct.height) || 75,
      },
      color: manualProduct.color,
      materials: ['custom'],
      source: 'manual',
      isApproximation: true,
    };
    addObject(product, [0, 0, 0]);
    if (product.price) addToShoppingList(product.id, product.name, product.price, product.currency);
    setShowManualForm(false);
    setManualProduct({ name: '', width: '', depth: '', height: '', color: '#f5f0eb', price: '', category: 'custom' });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] text-gray-200">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[#2a2a3e]">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset Library</h2>
      </div>

      {/* IKEA Import */}
      <div className="px-3 py-2.5 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400 text-sm">🔗</span>
          <span className="text-xs font-medium text-gray-300">IKEA Import</span>
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={ikeaUrl}
            onChange={(e) => setIkeaUrl(e.target.value)}
            placeholder="Paste IKEA URL..."
            className="flex-1 px-2.5 py-1.5 text-xs bg-[#16162a] border border-[#2a2a3e] rounded-md text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleIkeaImport()}
          />
          <button onClick={handleIkeaImport} className="px-2.5 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium hover:bg-indigo-500/30 transition-colors">
            Add
          </button>
        </div>
        <button onClick={() => setShowManualForm(!showManualForm)} className="mt-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          {showManualForm ? '▾ Hide manual form' : '▸ Add manually'}
        </button>
      </div>

      {/* Manual Form */}
      {showManualForm && (
        <div className="px-3 py-2.5 border-b border-[#2a2a3e] bg-[#16162a]/50">
          <div className="space-y-1.5">
            <input type="text" value={manualProduct.name} onChange={e => setManualProduct({ ...manualProduct, name: e.target.value })} placeholder="Name" className="w-full px-2 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none" />
            <div className="grid grid-cols-3 gap-1.5">
              <input type="number" value={manualProduct.width} onChange={e => setManualProduct({ ...manualProduct, width: e.target.value })} placeholder="W (cm)" className="px-2 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none" />
              <input type="number" value={manualProduct.depth} onChange={e => setManualProduct({ ...manualProduct, depth: e.target.value })} placeholder="D (cm)" className="px-2 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none" />
              <input type="number" value={manualProduct.height} onChange={e => setManualProduct({ ...manualProduct, height: e.target.value })} placeholder="H (cm)" className="px-2 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="flex gap-1.5">
              <input type="color" value={manualProduct.color} onChange={e => setManualProduct({ ...manualProduct, color: e.target.value })} className="w-8 h-7 rounded border border-[#2a2a3e] bg-transparent cursor-pointer" />
              <input type="number" value={manualProduct.price} onChange={e => setManualProduct({ ...manualProduct, price: e.target.value })} placeholder="Price" className="flex-1 px-2 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none" />
              <select value={manualProduct.category} onChange={e => setManualProduct({ ...manualProduct, category: e.target.value as FurnitureCategory })} className="flex-1 px-1 py-1 text-xs bg-[#1e1e2e] border border-[#2a2a3e] rounded text-gray-200 focus:border-indigo-500 focus:outline-none">
                <option value="custom">Custom</option>
                <option value="bed">Bed</option>
                <option value="desk">Desk</option>
                <option value="chair">Chair</option>
                <option value="dresser">Dresser</option>
                <option value="table">Table</option>
                <option value="lamp">Lamp</option>
              </select>
            </div>
            <button onClick={handleManualAdd} className="w-full py-1.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium hover:bg-indigo-500/30 transition-colors">
              Create Object
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-3 py-2 border-b border-[#2a2a3e]">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                activeCategory === cat.id ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-500 hover:text-gray-300 hover:bg-[#2a2a3e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Furniture List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredFurniture.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <span className="text-2xl mb-2">📦</span>
            <span className="text-xs">No items in this category</span>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFurniture.map((item, i) => (
              <button
                key={i}
                onClick={() => handleAddPreset(item)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-[#2a2a3e] transition-all group"
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg" style={{ backgroundColor: item.color + '22' }}>
                  {item.category === 'bed' ? '🛏' : item.category === 'desk' ? '🖥' : item.category === 'chair' ? '🪑' : item.category === 'dresser' ? '🗄' : item.category === 'lamp' ? '💡' : item.category === 'plant' ? '🌿' : item.category === 'rug' ? '🟫' : item.category === 'sofa' ? '🛋' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-gray-500">{item.dimensions.width}×{item.dimensions.depth}×{item.dimensions.height}cm</div>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">${item.price}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
