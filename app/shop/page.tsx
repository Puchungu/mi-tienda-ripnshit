// app/shop/page.tsx
import Link from 'next/link';
import { extractTextFromBlocks } from '../utils/strapi';

interface Category {
  id: number;
  documentId?: string;
  Nombre: string;
}

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

interface StrapiProductResponse {
  data: Product[];
  meta: unknown;
}

interface StrapiCategoryResponse {
  data: Category[];
  meta: unknown;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://127.0.0.1:1337/api/categories', { cache: 'no-store' });
    if (!res.ok) return [];
    const json: StrapiCategoryResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
}

async function getProductos(categoryName?: string): Promise<Product[]> {
  try {
    let url = 'http://127.0.0.1:1337/api/productos?populate=*';
    if (categoryName) {
      url += `&filters[category][Nombre][$eq]=${encodeURIComponent(categoryName)}`;
    }
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const json: StrapiProductResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  // En Next.js 15, searchParams es asíncrono y debe esperarse
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || null;

  const [categories, productos] = await Promise.all([
    getCategories(),
    getProductos(currentCategory || undefined)
  ]);

  const STRAPI_URL = "http://127.0.0.1:1337";

  return (
    <div className="selection:bg-purple-300 selection:text-purple-900 pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">

      {/* HEADER INFO */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter uppercase mb-4 leading-[0.85]">
            ALL <span className="text-zinc-400">PIECES</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium max-w-lg">
            The complete catalog. From core essentials to limited drops. Unapologetic aesthetic.
          </p>
        </div>

        {/* DYNAMIC FILTER BAR */}
        <div className="flex gap-4 overflow-x-auto pb-4 w-full md:w-auto md:pb-0 scrollbar-hide">
          <Link
            href="/shop"
            className={`px-5 py-2 rounded-full border text-xs font-bold tracking-widest uppercase flex-shrink-0 transition-colors ${!currentCategory ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'}`}
          >
            All
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.Nombre)}`}
              className={`px-5 py-2 rounded-full border text-xs font-bold tracking-widest uppercase flex-shrink-0 transition-colors ${currentCategory === cat.Nombre ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'}`}
            >
              {cat.Nombre}
            </Link>
          ))}
        </div>
      </div>

      {productos.length === 0 ? (

        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-zinc-200/50 mt-10">
          <p className="text-zinc-400 font-medium text-lg max-w-md mx-auto mb-6">
            There are currently no products available in this category.
          </p>
          {currentCategory && (
            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-purple-600 transition-colors">
              Clear Filters
            </Link>
          )}
        </div>

      ) : (

        /* PRODUCTS GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {productos.map((producto) => {
            let imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";

            if (producto.Imagen && !Array.isArray(producto.Imagen) && producto.Imagen.url) {
              imageUrl = `${STRAPI_URL}${producto.Imagen.url}`;
            } else if (Array.isArray(producto.Imagen) && producto.Imagen.length > 0 && producto.Imagen[0].url) {
              imageUrl = `${STRAPI_URL}${producto.Imagen[0].url}`;
            }

            const targetUrl = `/product/${producto.documentId || producto.id}`;

            return (
              <a href={targetUrl} key={producto.id} className="group relative flex flex-col bg-transparent cursor-pointer">

                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 mb-5 flex items-center justify-center border border-zinc-200/50">
                  <img
                    src={imageUrl}
                    alt={producto.Nombre}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle gradient overlay at bottom of image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick View Button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                    <button className="w-full py-3.5 bg-white/90 backdrop-blur-md text-zinc-900 font-black text-sm uppercase tracking-wider rounded-xl shadow-xl hover:bg-white transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-1.5 px-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                      {producto.Nombre}
                    </h3>
                    <p className="text-lg font-black text-zinc-900 whitespace-nowrap">
                      ${producto.Precio}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

      )}

    </div>
  );
}
