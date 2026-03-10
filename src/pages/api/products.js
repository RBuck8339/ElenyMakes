// 1. THIS IS MANDATORY for D1 to work in an API route
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // In the Edge Runtime, env is often accessed via the request's context
  // or via process.env in some OpenNext versions.
  const env = req.env || process.env; 

  if (!env || !env.DB) {
    return new Response(
      JSON.stringify({ error: "D1 Database binding 'DB' not found." }), 
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const { results } = await env.DB.prepare("SELECT * FROM products").all();
    
    const products = results.map(p => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      // Use standard JS parsing for safety
      materials: JSON.parse(p.materials || "[]"),
      colors: JSON.parse(p.colors || "[]"),
      pattern_exists: Boolean(p.pattern_exists)
    }));

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}