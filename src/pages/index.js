import items from '../../items.json';

import Header from '../components/header';
import Banner from '../components/banner';
// import Navigation from '../components/navigation';
import Item from '../components/item';

export default function Home() {
    // Render items to display all products
    // If "-combo" in item, group -bottom && -top images
    
    // Layering scheme:
    // - Header/Navigation at top
    // - Shop items grid below
    // - About section at bottom (optional)
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <Banner />
            <div className="h-16 w-full"/> {/* Just here for spacing */}

            <main className="w-full max-w-7xl mx-auto p-4 md:p-8 pt-20 mb-5">
    
                <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    {Object.entries(items).map(([key, item]) => (
                    
                        <div key={key} className="w-[calc(50%-1.5rem)] md:w-[calc(33%-2.5rem)] lg:w-[calc(25%-3rem)] min-w-[280px] max-w-[350px]">
                            <Item item={item} />
                        </div>
                    ))}
                </div>
            </main>
            
            {/* About section space */}
        </div>
    )
}