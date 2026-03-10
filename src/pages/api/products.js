import { getRequestContext } from '@opennextjs/cloudflare';

export default async function handler(req, res) {
  // 1. OpenNext's official way to get D1/R2 bindings
  const runtime = getRequestContext();
  const db = runtime?.env?.DB;

  if (!db) {
    return res.status(500).json({ 
      error: "D1 Database binding 'DB' not found.",
      debug: {
        hasRuntime: !!runtime,
        envKeys: runtime?.env ? Object.keys(runtime.env) : "no-env-found"
      }
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