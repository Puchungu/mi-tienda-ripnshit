// app/components/CartDrawer.tsx

'use client';

import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl h-full shadow-2xl flex flex-col border-l border-zinc-200 animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Tu Carrito</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-zinc-400 gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p className="font-bold uppercase tracking-widest text-xs">El carrito está vacío</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-zinc-900 border-b-2 border-zinc-900 pb-1 font-black text-xs uppercase"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                {/* Image */}
                <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200/50">
                  <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                
                {/* Info */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm uppercase leading-tight max-w-[150px]">{item.nombre}</h3>
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase mt-1">Talla: {item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-zinc-200 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 rounded-full"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 rounded-full"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-black text-sm">${item.precio * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50/50 flex flex-col gap-6">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subtotal</span>
              <span className="text-3xl font-black tracking-tighter">${totalPrice}</span>
            </div>
            
            <button className="group relative w-full inline-flex items-center justify-center px-8 py-5 text-sm font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-zinc-900/20">
              <span className="relative z-10 flex gap-2 items-center">
                Finalizar Compra
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p className="text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest">Impuestos y envío calculados al finalizar</p>
          </div>
        )}
      </div>
    </div>
  );
}
