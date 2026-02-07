import items from '../../items.json';

// TODO: Import navigation/header and other components when ready
// import Header from '../components/header';
// import Navigation from '../components/navigation';

export default function Home() {
    // Render items to display all products
    // If "-combo" in item, group -bottom && -top images
    
    // Layering scheme:
    // - Header/Navigation at top
    // - Shop items grid below
    // - About section at bottom (optional)
    
    return (
        <div className="home-page">
            {/* TODO: Add Header/Navigation component here */}
            {/* <Header /> */}
            
            <section className="shop-items">
                <h1>Shop</h1>
                <div className="items-grid">
                    {Object.entries(items).map(([key, item]) => (
                        <div key={key} className="item-card">
                            <h2>{item.item_name}</h2>
                            <p>{item.item_description}</p>
                            <p className="price">${item.price}</p>
                            {/* TODO: Add Item component here */}
                            {/* <Item itemKey={key} itemData={item} /> */}
                        </div>
                    ))}
                </div>
            </section>
            
            {/* TODO: Add about section here */}
        </div>
    )
}