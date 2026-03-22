import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe (requires STRIPE_SECRET_KEY in .env.local)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any,
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing.");
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    // 1. Fetch real prices from Strapi to prevent client-side manipulation
    // Optimally, we fetch all products in one go, but for simplicity here we map
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const internalProducts = [];

    for (const item of items) {
      // Fetch product from Strapi using documentId or id
      const res = await fetch(`${STRAPI_URL}/api/productos/${item.id}?populate=*`, { cache: 'no-store' });
      
      if (!res.ok) {
        // Fallback or handle error if product not found by documentId
        // For simplicity, we assume item.id is the documentId and exists
        console.error(`Product ${item.id} not found in Strapi.`);
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 404 });
      }

      const { data: strapiProduct } = await res.json();

      if (!strapiProduct) continue;

      // Build Strapi Image URL for Stripe
      let imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
      if (strapiProduct.Imagen) {
        if (!Array.isArray(strapiProduct.Imagen) && strapiProduct.Imagen.url) {
          imageUrl = `${STRAPI_URL}${strapiProduct.Imagen.url}`;
        } else if (Array.isArray(strapiProduct.Imagen) && strapiProduct.Imagen.length > 0 && strapiProduct.Imagen[0].url) {
          imageUrl = `${STRAPI_URL}${strapiProduct.Imagen[0].url}`;
        }
      }

      // 2. Build Stripe Line Items using REAL Strapi data
      line_items.push({
        price_data: {
          currency: 'usd', // Modify this to your store's currency e.g. 'mxn', 'eur'
          product_data: {
            name: `${strapiProduct.Nombre} - Size ${item.size}`,
            images: [imageUrl],
            metadata: {
              strapiId: strapiProduct.id.toString(),
              strapiDocumentId: strapiProduct.documentId,
              size: item.size
            }
          },
          unit_amount: Math.round(strapiProduct.Precio * 100), // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      });

      // Keep track for creating the Strapi Order later
      internalProducts.push({
        documentId: strapiProduct.documentId,
        size: item.size,
        quantity: item.quantity,
        price: strapiProduct.Precio
      });
    }

    // 3. Create Stripe Checkout Session
    const headersList = request.headers;
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'MX', 'ES'], // Add countries you ship to
      },
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        // We save the JSON string of products to read in the webhook
        products: JSON.stringify(internalProducts)
      }
    };

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
