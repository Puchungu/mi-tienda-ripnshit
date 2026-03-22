import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any,
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Parse products from metadata that we stored earlier
      const productsStr = session.metadata?.products;
      if (!productsStr) throw new Error("No products in metadata");

      const products = JSON.parse(productsStr);

      // Create Order in Strapi
      const orderData = {
        data: {
          stripeSessionId: session.id,
          email: session.customer_details?.email || "No email",
          total: session.amount_total ? (session.amount_total / 100) : 0,
          estatus: 'paid', // Changed from status to estatus per user configuration
          products: products,
          shippingAddress: session.customer_details?.address || {},
        }
      };

      const orderRes = await fetch(`${STRAPI_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderRes.ok) {
        const err = await orderRes.text();
        console.error("Failed to create Order in Strapi:", err);
      } else {
        console.log("Successfully created Order in Strapi:", session.id);
        
        // Decrement Strapi inventory
        for (const item of products) {
          try {
            // 1. Fetch current product data
            const prodRes = await fetch(`${STRAPI_URL}/api/productos/${item.documentId}?populate=*`, {
              cache: 'no-store'
            });
            if (!prodRes.ok) continue;

            const { data: strapiProduct } = await prodRes.json();
            if (!strapiProduct || !strapiProduct.TallasLimits) continue;

            // 2. Find the purchased size and decrement its stock limit
            const updatedTallas = strapiProduct.TallasLimits.map((tallaObj: any) => {
              if (tallaObj.Tallas === item.size) {
                // Ensure stock doesn't go below 0
                const newStock = Math.max(0, tallaObj.Limite - item.quantity);
                return { ...tallaObj, Limite: newStock };
              }
              return tallaObj;
            });

            // 3. Update the product in Strapi
            const updateRes = await fetch(`${STRAPI_URL}/api/productos/${item.documentId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(STRAPI_API_TOKEN ? { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } : {})
              },
              body: JSON.stringify({
                data: {
                  TallasLimits: updatedTallas
                }
              })
            });

            if (!updateRes.ok) {
              console.error(`Failed to update stock for product ${item.documentId}`, await updateRes.text());
            } else {
              console.log(`Stock updated for product ${item.documentId}, size ${item.size}`);
            }

          } catch (e) {
            console.error("Error updating inventory:", e);
          }
        }
      }

    } catch (err: any) {
      console.error("Error processing checkout.session.completed:", err.message);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
