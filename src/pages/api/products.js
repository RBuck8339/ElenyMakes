import productsFile from '../../data/products.json';

export default async function handler(req, res) {
  // 1. Try to find the LIVE D1 Database binding
  const db = req.env?.DB || process.env?.DB || globalThis?.DB;
  let rawResults = [];
  let dataSource = "live-db";

  if (db) {
    try {
      // 2. Attempt to fetch live data
      const { results } = await db.prepare("SELECT * FROM products").all();
      rawResults = results;
    } catch (dbError) {
      console.error("D1 Connection failed, falling back to JSON:", dbError);
      // Fallback if query fails
      rawResults = Array.isArray(productsFile) ? productsFile[0].results : [];
      dataSource = "fallback-json";
    }
  } else {
    // 3. Plan B: Use the JSON Manifest generated during the build
    console.warn("D1 Binding not found, using JSON fallback.");
    rawResults = Array.isArray(productsFile) ? productsFile[0].results : [];
    dataSource = "fallback-json";
  }

  // 4. Standardize the data format (regardless of source)
  const products = rawResults.map(p => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images || "[]") : (p.images || []),
    materials: typeof p.materials === 'string' ? JSON.parse(p.materials || "[]") : (p.materials || []),
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors || "[]") : (p.colors || []),
    price: Number(p.price || 0),
    pattern_exists: Boolean(p.pattern_exists)
  }));

  // 5. Send it back with a debug header so you can see which source was used
  res.setHeader('X-Data-Source', dataSource);
  return res.status(200).json(products);
}