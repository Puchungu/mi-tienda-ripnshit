import Link from 'next/link';

export const dynamic = 'force-dynamic';

// app/collections/page.tsx

interface Collection {
  id: number;
  documentId?: string;
  Nombre: string;
  Descripcion: string;
  Slug?: string;
  ImagenPortada?: {
    url: string;
  } | { url: string }[] | null;
}

interface StrapiResponse {
  data: Collection[];
  meta: unknown;
}

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${API_URL}/api/collections?populate=*`, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }
    const json: StrapiResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching collections", error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  const STRAPI_URL = API_URL;

  return (
    <div className="selection:bg-purple-300 selection:text-purple-900 pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER INFO */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter uppercase mb-6 leading-[0.85]">
          Curated <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
            Collections
          </span>
        </h1>
        <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
          Explore our exclusive drops and seasonal curations. Each collection tells a different story within our aesthetic universe.
        </p>
      </div>

      {collections.length === 0 ? (
        
        /* EMPTY STATE / NO COLLECTIONS YET */
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-zinc-200/50 mt-10">
          <p className="text-zinc-400 font-medium text-lg max-w-md mx-auto mb-6">
            There are currently no active collections. New aesthetic drops are coming soon.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-purple-600 transition-colors">
            Back to Shop
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

      ) : (

        /* COLLECTIONS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => {
            let imageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";

            if (collection.ImagenPortada && !Array.isArray(collection.ImagenPortada) && (collection.ImagenPortada as any).url) {
              imageUrl = `${STRAPI_URL}${(collection.ImagenPortada as any).url}`;
            } else if (Array.isArray(collection.ImagenPortada) && collection.ImagenPortada.length > 0 && collection.ImagenPortada[0].url) {
              imageUrl = `${STRAPI_URL}${collection.ImagenPortada[0].url}`;
            }

            // PRIORITIZE documentId for V5 stability
            const targetId = collection.documentId || collection.id.toString();
            const targetUrl = collection.Slug ? `/collections/${collection.Slug}` : `/collections/${targetId}`;

            return (
              <Link href={targetUrl} key={collection.id} className="group relative flex flex-col bg-transparent cursor-pointer">
                
                {/* Image Wrapper */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100 flex items-center justify-center border border-zinc-200/50">
                  <img
                    src={imageUrl}
                    alt={collection.Nombre}
                    className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 ease-out flex flex-col justify-end h-full">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 group-hover:-translate-y-2 transition-transform duration-300">
                      {collection.Nombre}
                    </h2>
                    <p className="text-white/80 font-medium text-sm line-clamp-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      {collection.Descripcion}
                    </p>
                    
                    {/* View Collection Button */}
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150">
                      Explore Drop
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      )}

    </div>
  );
}
