'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isFulfilling, setIsFulfilling] = useState(true);

  useEffect(() => {
    // Clear the cart securely from React state
    clearCart();
    
    // Hard-clear local storage to prevent browser cache (bfcache) rehydration
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mi-tienda-cart');
    }

    // Trigger local fulfillment without Webhooks
    if (sessionId) {
      fetch('/api/orders/fulfill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Fulfillment status:", data);
        setIsFulfilling(false);
      })
      .catch(err => {
        console.error("Fulfillment error:", err);
        setIsFulfilling(false);
      });
    } else {
      setIsFulfilling(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">
          Order Confirmed
        </h1>
        
        <p className="text-zinc-500 font-medium">
          Thank you for your purchase. Your payment was successful and we are now processing your aesthetic drop. A confirmation email is on its way.
        </p>

        <div className="pt-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center w-full px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all bg-zinc-900 rounded-xl hover:bg-zinc-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

