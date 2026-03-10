import { getRequestContext } from '@opennextjs/cloudflare';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const context = getRequestContext();
  const db = context?.env?.DB;

  if (!db) {
    return new Response(JSON.stringify({ error: "DB not found" }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' } 
    });
  }

  try {
    const { results } = await db.prepare("SELECT * FROM products").all();
    
    const products = results.map(p => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      materials: JSON.parse(p.materials || "[]"),
      colors: JSON.parse(p.colors || "[]"),
      price: Number(p.price),
      pattern_exists: Boolean(p.pattern_exists)
    }));

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}