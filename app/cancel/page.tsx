import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">
          Payment Cancelled
        </h1>
        
        <p className="text-zinc-500 font-medium">
          Your checkout process was interrupted. Don't worry, your cart is safe. You can complete your purchase whenever you're ready.
        </p>

        <div className="pt-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center w-full px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all bg-zinc-900 rounded-xl hover:bg-zinc-800"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
