const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' }); 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
  console.log("Fetching latest products from Supabase...");

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error || !data) {
    console.error("Build failed: Could not fetch products.", error);
    process.exit(1); 
  }

  // This creates the EXACT structure your index.js needs
  const output = [{
    results: data.map(p => ({
      id: p.id,
      slug: p.slug,
      item_name: p.item_name,
      item_description: p.item_description,
      item_type: p.item_type,
      price: Number(p.price), // Ensures 3.6 stays a number, not a string
      materials: p.materials,
      colors: p.colors,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      pattern_exists: Boolean(p.pattern_exists)
    })),
    success: true
  }];

  fs.writeFileSync('./src/data/products.json', JSON.stringify(output, null, 2));
  console.log("✅ products.json updated in standard wrapper format.");
}

sync();