// app/components/Header.tsx

'use client';

import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" className="text-2xl font-black tracking-tighter uppercase text-zinc-900 transition-opacity hover:opacity-80">
          Rip<span className="text-purple-600">N</span>Shit.
        </a>
        <nav className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase text-zinc-500">
          <a href="/shop" className="hover:text-zinc-900 transition-colors">Shop</a>
          <a href="/collections" className="hover:text-zinc-900 transition-colors">Collections</a>
          <a href="/about" className="hover:text-zinc-900 transition-colors">About</a>
        </nav>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative group bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-black w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
