import Link from 'next/link';
import { extractTextFromBlocks } from './utils/strapi';
import CountdownTimer from './components/CountdownTimer';


interface Product {
  id: number;
  documentId?: string;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Imagen: {
    url: string;
  } | { url: string }[] | null;
}

interface StrapiResponse {
  data: Product[];
  meta: unknown;
}

// 1. Función para pedir los datos a Strapi
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

async function getProductos(): Promise<StrapiResponse> {
  const res = await fetch(`${API_URL}/api/productos?populate=*`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Fallo al traer los datos');
  }

  return res.json();
}

export default async function Home() {
  const { data: productos } = await getProductos();
  const STRAPI_URL = API_URL;

  // Set target date for the next drop (7 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  return (
    <div className="selection:bg-purple-300 selection:text-purple-900">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        {/* Decorative Blurred Blobs */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-rose-300/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-zinc-200/50 text-xs font-bold tracking-widest uppercase mb-8 text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            New Drop 001
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-zinc-900 tracking-tighter uppercase mb-6 leading-[0.85]">
            Aesthetic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400">
              Culture
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Elevating modern streetwear. Clean lines, bold expressions, and strictly aesthetic vibes for the youth.
          </p>

          <CountdownTimer targetDate={targetDate.toISOString()} />

          <Link href="/collections" className="group relative inline-flex items-center justify-center px-10 py-5 text-sm font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-zinc-900/20 mt-12">
            <span className="relative z-10">Shop Collection</span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="shop" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900">
            Trending <span className="text-zinc-400">Now</span>
          </h2>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {productos.map((producto) => {
            let imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";

            if (producto.Imagen && !Array.isArray(producto.Imagen) && producto.Imagen.url) {
              imageUrl = `${STRAPI_URL}${producto.Imagen.url}`;
            } else if (Array.isArray(producto.Imagen) && producto.Imagen.length > 0 && producto.Imagen[0].url) {
              imageUrl = `${STRAPI_URL}${producto.Imagen[0].url}`;
            }

            return (
              <Link href={`/product/${producto.documentId || producto.id}`} key={producto.documentId || producto.id} className="block outline-none">
                <div className="group relative flex flex-col bg-transparent cursor-pointer h-full">

                  {/* Image Wrapper */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 mb-5 flex items-center justify-center border border-zinc-200/50 group-hover:border-zinc-400 transition-colors duration-500">
                    <img
                      src={imageUrl}
                      alt={producto.Nombre}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Center 'View Details' Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out pointer-events-none">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full border border-white/30 shadow-2xl">
                        Ver Detalles
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col space-y-1.5 px-1 transform transition-transform duration-500 group-hover:translate-x-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-purple-600 transition-colors duration-300">
                        {producto.Nombre}
                      </h3>
                      <p className="text-lg font-black text-zinc-900">
                        ${producto.Precio}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}