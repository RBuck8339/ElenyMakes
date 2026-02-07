import items from '../../items.json';

import Header from '../components/header';
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
        
        {/* Simplified container to remove flex interference */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 md:mb-8 text-main-brown text-center md:text-left">
                Shop
            </h1>
            
           
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {Object.entries(items).map(([key, item]) => (
                    <Item key={key} item={item} />
                ))}
            </div>
        </main>
        
        {/* About section space */}
    </div>
    )
}