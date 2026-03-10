export default async function handler(req, res) {
  const env = req.env || process.env; 

  if (!env || !env.DB) {
    return res.status(500).json({ error: "D1 Database binding 'DB' not found." });
  }
  try {
    const { results } = await env.DB.prepare("SELECT * FROM products").all();
    
    const products = results.map(p => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      pattern_exists: Boolean(p.pattern_exists)
    }));

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}