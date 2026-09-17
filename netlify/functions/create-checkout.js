const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Méthode non autorisée' }) };

  try {
    const { items = [], customer = {} } = JSON.parse(event.body || '{}');
    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Panier vide' }) };
    }

    // Prices are validated server-side from the catalogue below.
    // Never trust prices sent by the browser.
    const catalogue = {
      1: { name: 'T-shirt graphique Yalys', amount: 2499 },
      2: { name: 'Hoodie oversize Yalys', amount: 4499 },
      3: { name: 'Pantalon cargo streetwear', amount: 3999 },
      4: { name: 'Chemise coton-lin', amount: 3499 },
      5: { name: 'Casquette streetwear', amount: 1999 },
      6: { name: 'Ceinture boucle automatique', amount: 2499 },
      7: { name: 'Écharpe légère Yalys', amount: 1999 },
      8: { name: 'Bracelet perles élégant', amount: 1499 },
      9: { name: "Boucles d'oreilles élégantes", amount: 1699 },
      10: { name: 'Chaussettes sport', amount: 1299 },
      11: { name: 'Lunettes tendance', amount: 1799 },
      12: { name: 'Sac tendance', amount: 2999 }
    };

    const line_items = items.map((item) => {
      const product = catalogue[Number(item.id)];
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      if (!product) throw new Error('Produit invalide');
      return {
        price_data: {
          currency: 'eur',
          product_data: { name: product.name },
          unit_amount: product.amount
        },
        quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: typeof customer.email === 'string' ? customer.email : undefined,
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['FR'] },
      success_url: `${process.env.URL || 'http://localhost:8888'}/?payment=success`,
      cancel_url: `${process.env.URL || 'http://localhost:8888'}/?payment=cancelled`,
      metadata: { store: 'Yalys Store' }
    });

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Impossible de créer le paiement.' }) };
  }
};
