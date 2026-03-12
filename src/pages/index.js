import Header from '../components/header';
import Banner from '../components/banner';
import Disclaimer from '../components/disclaimer';
import Item from '../components/item';

// The D1 JSON snapshot
import productsData from '../data/products.json';

export async function getStaticProps() {
    // Exact path for your specific JSON structure: data[0].results
    const rawResults = productsData[0]?.results || [];

    const products = rawResults.map(p => ({
        ...p,
        // Parse the JSON strings for arrays
        images: typeof p.images === 'string' ? JSON.parse(p.images || "[]") : (p.images || []),
        materials: typeof p.materials === 'string' ? JSON.parse(p.materials || "[]") : (p.materials || []),
        colors: typeof p.colors === 'string' ? JSON.parse(p.colors || "[]") : (p.colors || []),
        
        // Force numeric types for logic and display
        price: Number(p.price || 0),
        pattern_exists: Number(p.pattern_exists) === 1
    }));

    return {
        props: { products },
        revalidate: false 
    };
}

export default function Home({products}) {
    // Render items to display all products
    // If "-combo" in item, group -bottom && -top images
    
    // Layering scheme:
    // - Header/Navigation at top
    // - Shop items grid below
    // - About section at bottom (optional)
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            {/* <Banner /> */}
            <div className="h-32 w-full"/> {/* Just here for spacing */}

            <main className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-20 mb-5">
    
                <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    {products.map((item) => (
                        <div key={item.id} className="w-[calc(50%-1.5rem)] md:w-[calc(33%-2.5rem)] lg:w-[calc(25%-3rem)] min-w-[280px] max-w-[350px]">
                            <Item item={item} />
                        </div>
                    ))}
                </div>
            </main>
            
            {/* About section space */}
            <Disclaimer />
        </div>
    )
}
