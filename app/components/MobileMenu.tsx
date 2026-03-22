// app/components/MobileMenu.tsx

'use client';

import React from 'react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className="relative w-[85%] max-w-sm h-full shadow-2xl flex flex-col border-r border-zinc-200 animate-slide-in-left z-[110]"
        style={{ backgroundColor: 'white', opacity: 1 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-white">
          <span className="text-xl font-black tracking-tighter uppercase text-zinc-900">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-8 gap-8 bg-white flex-grow">
          <Link 
            href="/shop" 
            onClick={onClose}
            className="text-4xl font-black uppercase tracking-tighter text-zinc-900 hover:text-purple-600 transition-colors drop-shadow-sm"
          >
            Shop
          </Link>
          <Link 
            href="/collections" 
            onClick={onClose}
            className="text-4xl font-black uppercase tracking-tighter text-zinc-900 hover:text-purple-600 transition-colors drop-shadow-sm"
          >
            Collections
          </Link>
          <Link 
            href="/about" 
            onClick={onClose}
            className="text-4xl font-black uppercase tracking-tighter text-zinc-900 hover:text-purple-600 transition-colors drop-shadow-sm"
          >
            About
          </Link>
        </nav>

        {/* Footer info */}
        <div className="p-8 border-t border-zinc-100 italic text-zinc-500 font-medium text-sm bg-white">
          Aesthetic streetwear for the culture.
        </div>
      </div>
    </div>
  );
}
