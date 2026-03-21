// app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import { extractTextFromBlocks, extractVariantes } from '../../utils/strapi';
import ProductDetails from '../../components/ProductDetails';

interface Product {
  id: number;
  documentId?: string;
  Nombre: string;
  Descripcion: any;
  Precio: number;
  Imagen: any;
  Variantes?: any[];
}

async function getProducto(id: string): Promise<Product | null> {
  try {
    // Explicitly populate Imagen and Variantes for Strapi V5
    const res = await fetch(`http://127.0.0.1:1337/api/productos/${id}?populate[0]=Imagen&populate[1]=Variantes`, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching product", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = await getProducto(id);

  if (!producto) {
    notFound();
  }

  const STRAPI_URL = "http://127.0.0.1:1337";

  // Robust Image URL handling for Strapi V5
  let imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
  if (producto.Imagen) {
    if (!Array.isArray(producto.Imagen) && producto.Imagen.url) {
      imageUrl = `${STRAPI_URL}${producto.Imagen.url}`;
    } else if (Array.isArray(producto.Imagen) && producto.Imagen.length > 0 && producto.Imagen[0].url) {
      imageUrl = `${STRAPI_URL}${producto.Imagen[0].url}`;
    }
  }

  // Use the utility to parse Strapi Blocks
  const descriptionText = extractTextFromBlocks(producto.Descripcion);
  
  // Use the utility to extract variants
  const variants = extractVariantes(producto);

  return (
    <ProductDetails 
      id={producto.documentId || producto.id}
      nombre={producto.Nombre}
      precio={producto.Precio}
      imageUrl={imageUrl}
      descriptionText={descriptionText}
      variants={variants}
    />
  );
}
