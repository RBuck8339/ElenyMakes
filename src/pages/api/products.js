export default async function handler(req, res) {
  // 1. Check every possible location Cloudflare/OpenNext places the bindings
  const env = req.env || 
              req.context?.cloudflare?.env || 
              process.env || 
              globalThis;

  // 2. Debugging: If it still fails, we want to see what IS available
  if (!env || !env.DB) {
    console.error("Environment check failed. Keys found:", Object.keys(env || {}));
    return res.status(500).json({ 
      error: "D1 Database binding 'DB' not found.",
      available_keys: Object.keys(env || {}) 
    });
  }

  try {
    const { results } = await env.DB.prepare("SELECT * FROM products").all();
    
    const products = results.map(p => ({
      ...p,
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