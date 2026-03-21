// app/components/SizeSelector.tsx

'use client';

import { useState } from 'react';

interface Variant {
  size: string;
  stock: number;
}

interface Props {
  variants: Variant[];
  onSelect: (size: string) => void;
  selectedSize: string | null;
}

export default function SizeSelector({ variants, onSelect, selectedSize }: Props) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold tracking-widest uppercase text-zinc-900">Select Size</span>
        <span className="text-xs font-bold tracking-widest uppercase text-zinc-400 cursor-pointer hover:text-zinc-900">Size Guide</span>
      </div>
      <div className="flex gap-3">
        {variants.map((v) => (
          <button
            key={v.size}
            disabled={v.stock === 0}
            onClick={() => onSelect(v.size)}
            className={`w-14 h-14 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${v.stock === 0
              ? 'opacity-30 cursor-not-allowed border-zinc-200'
              : selectedSize === v.size
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900'
              }`}
          >
            {v.size}
          </button>
        ))}
      </div>
    </div>
  );
}
