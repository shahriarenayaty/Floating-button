import React, { useState } from 'react';
import { LiquidFab } from './components/LiquidFab';
import { Toast } from './components/Toast';
import { FabMode } from './types';

// Mock Data for the Gallery Background
const MOCK_IMAGES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/400/500?random=${i}`,
  height: i % 2 === 0 ? 'h-64' : 'h-48' // Masonry feel
}));

export default function App() {
  const [mode, setMode] = useState<FabMode>('mixed');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const count = files.length;
    showToast(`Simulating upload of ${count} file${count > 1 ? 's' : ''}...`);
  };

  const handleDisabledClick = () => {
    showToast('This album is currently archived. You cannot add new items.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      
      {/* 1. TOP TESTING HARNESS */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/90 backdrop-blur-md border-b border-white/10 p-2 safe-top">
        <div className="max-w-md mx-auto flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['photo', 'video', 'mixed', 'disabled'] as FabMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                ${mode === m 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'}
              `}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT (GALLERY GRID) */}
      <main className="pt-20 pb-32 px-2 max-w-lg mx-auto">
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            Shared Moments
          </h1>
          <p className="text-sm text-gray-400">Scan QR to join • 24 Photos</p>
        </div>

        <div className="columns-2 gap-2 space-y-2">
          {MOCK_IMAGES.map((img) => (
            <div key={img.id} className="relative break-inside-avoid rounded-xl overflow-hidden group">
              <img 
                src={img.url} 
                alt="Gallery item" 
                className={`w-full ${img.height} object-cover bg-slate-800 transition-transform duration-700 group-hover:scale-105`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </main>

      {/* 3. THE COMPONENT UNDER TEST */}
      <LiquidFab 
        mode={mode}
        onUpload={handleUpload}
        onDisabledClick={handleDisabledClick}
      />

      {/* 4. FEEDBACK TOAST */}
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage(null)} 
      />

    </div>
  );
}