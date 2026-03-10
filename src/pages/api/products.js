// 1. REMOVE the edge config line. It's causing the crash.

export default async function handler(req, res) {
  // 2. OpenNext injects the Cloudflare 'env' into the request object
  const env = req.env || process.env; 

  if (!env || !env.DB) {
    return res.status(500).json({ error: "D1 Database binding 'DB' not found." });
  }

  try {
    const { results } = await env.DB.prepare("SELECT * FROM products").all();
    
    const products = results.map(p => ({
      ...p,
      // Safely parse JSON strings from D1
      images: JSON.parse(p.images || "[]"),
      materials: JSON.parse(p.materials || "[]"),
      colors: JSON.parse(p.colors || "[]"),
      pattern_exists: Boolean(p.pattern_exists)
    }));

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}