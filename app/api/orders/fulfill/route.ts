import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any,
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    // 1. Fetch the session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // 2. Check if this order already exists in Strapi to prevent duplicates on page refresh
    const existingOrderRes = await fetch(`${STRAPI_URL}/api/orders?filters[stripeSessionId][$eq]=${session_id}`, {
      cache: 'no-store'
    });
    const existingOrderData = await existingOrderRes.json();
    
    if (existingOrderData.data && existingOrderData.data.length > 0) {
      return NextResponse.json({ message: "Order already fulfilled" }, { status: 200 });
    }

    // 3. Parse products
    const productsStr = session.metadata?.products;
    if (!productsStr) throw new Error("No products in metadata");
    const products = JSON.parse(productsStr);

    // 4. Create Order in Strapi
    const orderData = {
      data: {
        stripeSessionId: session.id,
        email: session.customer_details?.email || "No email",
        total: session.amount_total ? (session.amount_total / 100) : 0,
        estatus: 'paid', // using the custom field requested
        products: products,
        shippingAddress: session.customer_details?.address || {},
      }
    };

    const orderRes = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN ? { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } : {})
      },
      body: JSON.stringify(orderData)
    });

    if (!orderRes.ok) {
      console.error("Failed to create Order in Strapi:", await orderRes.text());
      return NextResponse.json({ error: "Failed to create Order in Strapi" }, { status: 500 });
    }

    console.log(`Successfully created Order in Strapi: ${session.id}`);

    // 5. Decrement Strapi inventory safely
    for (const item of products) {
      try {
        const prodRes = await fetch(`${STRAPI_URL}/api/productos/${item.documentId}?populate=*`, { cache: 'no-store' });
        if (!prodRes.ok) continue;

        const { data: strapiProduct } = await prodRes.json();
        if (!strapiProduct || !strapiProduct.TallasLimits) continue;

        const updatedTallas = strapiProduct.TallasLimits.map((tallaObj: any) => {
          if (tallaObj.Tallas === item.size) {
            const newStock = Math.max(0, tallaObj.Limite - item.quantity);
            return { ...tallaObj, Limite: newStock };
          }
          return tallaObj;
        });

        const updateRes = await fetch(`${STRAPI_URL}/api/productos/${item.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_API_TOKEN ? { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } : {})
          },
          body: JSON.stringify({ data: { TallasLimits: updatedTallas } })
        });

        if (!updateRes.ok) {
          const errorText = await updateRes.text();
          console.error(`Failed to update stock for ${item.documentId}:`, errorText);
        } else {
          console.log(`Stock updated for ${item.documentId}, size ${item.size}`);
        }

      } catch (e) {
        console.error("Error updating inventory:", e);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Fulfillment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
