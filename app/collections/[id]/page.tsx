// app/collections/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { extractTextFromBlocks } from '../../utils/strapi';

interface Product {
  id: number;
  documentId?: string;
  Nombre: string;
  Descripcion: any;
  Precio: number;
  Imagen: any;
}

interface Collection {
  id: number;
  documentId?: string;
  Nombre: string;
  Descripcion: string;
  ImagenPortada?: any;
  productos: Product[];
}

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

async function getCollection(id: string): Promise<Collection | null> {
  const STRAPI_BASE = `${API_URL}/api/collections`;
  // Use =true for media fields in V5 to avoid ValidationError on related nested relations
  const queryParams = 'populate[productos][populate]=*&populate[ImagenPortada]=true';

  try {
    // Attempt 1: Standard V5 Path-based Fetch (documentId)
    // This is the fastest if permitted and the ID is a documentId
    let res = await fetch(`${STRAPI_BASE}/${id}?${queryParams}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }

    // Attempt 2: Filter-based Fetch (Search by documentId)
    // Works if findOne is disabled but find is enabled
    res = await fetch(`${STRAPI_BASE}?filters[documentId][$eq]=${id}&${queryParams}`, { cache: 'no-store' });
    let json = await res.json();
    if (json.data && json.data.length > 0) return json.data[0];

    // Attempt 3: Filter-based Fetch (Search by numeric ID)
    if (!isNaN(Number(id))) {
      res = await fetch(`${STRAPI_BASE}?filters[id][$eq]=${id}&${queryParams}`, { cache: 'no-store' });
      json = await res.json();
      if (json.data && json.data.length > 0) return json.data[0];
    }

    // Attempt 4: Filter-based Fetch (Search by name - last resort if encoded)
    // Decodes %20 to spaces for matching
    const decodedName = decodeURIComponent(id);
    res = await fetch(`${STRAPI_BASE}?filters[Nombre][$eq]=${decodedName}&${queryParams}`, { cache: 'no-store' });
    json = await res.json();
    if (json.data && json.data.length > 0) return json.data[0];

    return null;
  } catch (error) {
    console.error("SuperFetch failed", error);
    return null;
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  const STRAPI_URL = API_URL;

  // Collection Cover Image logic
  let coverImageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200";
  if (collection.ImagenPortada) {
    if (!Array.isArray(collection.ImagenPortada) && collection.ImagenPortada.url) {
      coverImageUrl = `${STRAPI_URL}${collection.ImagenPortada.url}`;
    } else if (Array.isArray(collection.ImagenPortada) && collection.ImagenPortada.length > 0 && collection.ImagenPortada[0].url) {
      coverImageUrl = `${STRAPI_URL}${collection.ImagenPortada[0].url}`;
    }
  }

  const productos = collection.productos || [];

  return (
    <div className="selection:bg-purple-300 selection:text-purple-900 min-h-screen">
      
      {/* COLLECTION HERO */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900">
          <img 
            src={coverImageUrl} 
            alt={collection.Nombre} 
            className="w-full h-full object-cover opacity-60" 
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-white">
            Current Collection
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.85]">
            {collection.Nombre}
          </h1>
          <p className="text-lg text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            {collection.Descripcion}
          </p>
        </div>
      </section>

      {/* PRODUCTS LIST */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 border-l-4 border-purple-600 pl-4">
            Collection <span className="text-zinc-400">Items</span> ({productos.length})
          </h2>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Próximamente... No hay productos vinculados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {productos.map((producto) => {
              // Robust image handling for Strapi V5 nested structure
              let productImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
              if (producto.Imagen) {
                if (!Array.isArray(producto.Imagen) && producto.Imagen.url) {
                  productImageUrl = `${STRAPI_URL}${producto.Imagen.url}`;
                } else if (Array.isArray(producto.Imagen) && producto.Imagen.length > 0 && producto.Imagen[0].url) {
                  productImageUrl = `${STRAPI_URL}${producto.Imagen[0].url}`;
                }
              }

              return (
                <Link 
                  href={`/product/${producto.documentId || producto.id}`} 
                  key={producto.documentId || producto.id} 
                  className="block outline-none"
                >
                  <div className="group relative flex flex-col bg-transparent cursor-pointer h-full">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 mb-5 flex items-center justify-center border border-zinc-200/50 group-hover:border-zinc-400 transition-colors duration-500">
                      <img
                        src={productImageUrl}
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

                    <div className="flex flex-col space-y-1 px-1 transform transition-transform duration-500 group-hover:translate-x-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-purple-600 transition-colors duration-300">
                          {producto.Nombre}
                        </h3>
                        <p className="text-lg font-black text-zinc-900">
                          ${producto.Precio}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-zinc-500 line-clamp-1">
                        {extractTextFromBlocks(producto.Descripcion)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
