// app/components/ProductDetails.tsx

'use client';

import { useState } from 'react';
import SizeSelector from './SizeSelector';
import { useCart } from '../context/CartContext';

interface Variant {
  size: string;
  stock: number;
}

interface Props {
  id: string | number;
  nombre: string;
  precio: number;
  imageUrl: string;
  descriptionText: string;
  variants: Variant[];
}

export default function ProductDetails({ id, nombre, precio, imageUrl, descriptionText, variants }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  
  // A variant is available if it exists and has stock > 0
  const selectedVariant = variants.find(v => v.size === selectedSize);
  const isAvailable = selectedVariant ? selectedVariant.stock > 0 : false;

  const handleAddToCart = () => {
    if (selectedSize && isAvailable) {
      addItem({
        id,
        nombre,
        precio,
        imageUrl,
        size: selectedSize
      });
    }
  };

  return (
    <div className="selection:bg-purple-300 selection:text-purple-900">

      {/* PRODUCT DETAIL SECTION */}
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm font-bold tracking-widest uppercase text-zinc-400">
          <a href="/" className="hover:text-zinc-900 transition-colors">Home</a>
          <span>/</span>
          <span className="text-zinc-900">Product</span>
          <span>/</span>
          <span className="text-zinc-900 truncate max-w-[150px]">{nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* IMAGE GALLERY */}
          <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[75vh] min-h-[500px] w-full bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200/50 flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 mix-blend-multiply" />
            
            <img 
              src={imageUrl} 
              alt={nombre} 
              className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          {/* PRODUCT INFO BLOCKS */}
          <div className="flex flex-col pt-4 lg:pt-10 sticky top-32">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/50 text-xs font-bold tracking-widest uppercase mb-6 text-zinc-600 self-start">
              Limited Edition
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter uppercase mb-4 leading-[0.9]">
              {nombre}
            </h1>
            
            <p className="text-3xl md:text-4xl font-black text-zinc-900 mb-8 border-b border-zinc-200/50 pb-8">
              ${precio}
            </p>

            <div className="mb-10 text-zinc-500 font-medium leading-relaxed max-w-lg">
              {descriptionText}
            </div>

            {/* SIZES */}
            <SizeSelector 
              variants={variants} 
              selectedSize={selectedSize} 
              onSelect={setSelectedSize} 
            />

            {/* ADD TO CART ACTION */}
            <button 
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`group relative w-full inline-flex items-center justify-center px-8 py-6 text-sm font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-zinc-900/20 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10 flex gap-2 items-center">
                {isAvailable ? 'Add To Cart' : selectedSize ? 'Out Of Stock' : 'Select a Size'}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* ACCORDION INFO */}
            <div className="mt-16 border-t border-zinc-200/50 pt-8 flex flex-col gap-6">
              <div className="group cursor-pointer">
                <div className="flex justify-between items-center text-sm font-bold tracking-widest uppercase text-zinc-900 mb-2">
                  <span>Shipping & Returns</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-zinc-900"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <p className="text-sm text-zinc-500 font-medium">Free worldwide shipping on all orders over $150. Returns accepted within 14 days.</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
