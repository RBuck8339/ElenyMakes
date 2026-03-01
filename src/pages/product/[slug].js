import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import itemsData from '../../../items.json';
import Header from '../../components/header';
import Carousel from '../../components/carousel';
import {updateCart} from '../../logic/updateCart';

// Makes the colors visibly stand out more
const COLOR_MAP = {
    "Blue": "#8EAFC8", 
    "Light Blue": "#D0E1F9", 
    "White": "#FFFFFF", 
    "Cream": "#F9F6F3",  
    "Light Grey": "#D1D5DB", 
    "Dark Grey": "#4B5563", 
    "Red": "#C56E70", 
    "Black": "#000000" 
}
const getLightVersion = (hex) => `${hex}66`;

export default function ProductDetails({ item }) {
    // Get the images for the item, we will replicate the carousel from the <Item> component here
    const itemImages = item.images?.length > 0 
        ? item.images.map(img => img.startsWith('/') ? img : `/${img}`)
        : [];

    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        // Check once on load
        const checkCartStatus = () => {
            const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]");
            setInCart(currentCart.includes(item.id));
        };
        checkCartStatus();

        window.addEventListener('updateCart', checkCartStatus);
        return () => window.removeEventListener('updateCart', checkCartStatus);
    }, [item.id]);

    
    // FIX 4: Simplified Handler
    const handleCartToggle = (e) => {
        // Optional: Prevent clicking the button from opening the "View Details" link if wrapped
        e?.stopPropagation(); 
        
        const newState = !inCart;
        updateCart(item.id, newState); // Run the logic
        // No need to setInCart here because the event listener above will catch it!
        // But setting it manually makes it feel snappier:
        setInCart(newState); 
    };

    return (
        <div className="flex flex-col h-screen bg-background w-full overflow-hidden">
            <Header />
            
            <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)] mt-8 items-stretch justify-center p-4 lg:p-8 gap-16 max-w-[1600px] mx-auto">
            
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <div className="bg-main-pink rounded-3xl w-full max-w-lg aspect-square p-2 md:p-6 flex items-center justify-center shadow-sm border-1 border-accent-green">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white">
                            <Carousel images={itemImages}/>
                        </div>  
                    </div>
                </div>

                {/* 4. Right Side: Details (Scrollable internally if text is long) */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 overflow-y-auto pr-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-text-espresso mb-2">{item.item_name}</h1>
                        <p className="text-sm font-bold text-text-espresso/50 uppercase tracking-widest">{item.item_type || 'Original Design'}</p>
                    </div>

                    <p className="text-4xl font-semibold text-accent-green">${item.price}</p>
                    
                    <div className="max-w-xl">
                        <h3 className="font-bold text-text-espresso mb-2 text-lg">Description</h3>
                        <p className="text-text-espresso/80 leading-relaxed text-lg">
                            {item.item_description || "Handcrafted with love."}
                        </p>
                    </div>

                    <div className="flex flex-row gap-10">
                        <div className="flex flex-col mr-4">
                            <h3 className="font-bold text-text-espresso mb-2 text-lg">Materials:</h3>
                            <ul className="list-disc pl-4">
                                {(item.materials || []).map((material, index) => (
                                    <li key={index} className="text-text-espresso/80">{material}</li>
                                ))}
                            </ul>
                        </div>
                        {item.colors?.length > 0 && (
                        <div className="flex flex-col">
                            <h3 className="font-bold text-text-espresso mb-2 text-lg">Colors:</h3>
                            <ul className="flex flex-wrap gap-2">
                                {item.colors.map((color, index) => {
                                    const pureColor = COLOR_MAP[color] || "#F9F6F3";
                                    const lightColor = getLightVersion(pureColor);
                                    
                                    // Ensure dark colors have white text when "pure"
                                    const isDark = ["Black", "Dark Grey"].includes(color);

                                    return (
                                        <li 
                                            key={index} 
                                            className="px-3 py-1 rounded-md border border-main-brown/10 text-sm font-medium 
                                                    transition-all duration-300 cursor-default select-none shadow-sm"
                                            style={{ 
                                                backgroundColor: lightColor,
                                                color: "inherit" // Initial state
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = pureColor;
                                                if (isDark) e.target.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = lightColor;
                                                e.target.style.color = "inherit";
                                            }}
                                        >
                                            {color}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    </div>

                    <div className="flex flex-row gap-4 w-full max-w-2xl">
                        <button 
                            className="flex-1 bg-other-pink1 text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-105 active:scale-95 transition-all truncate px-2"
                            onClick={handleCartToggle}
                        >
                            {inCart ? "Remove from Cart" : "Add to Cart"}
                        </button>
                        {inCart && (
                            <Link
                                href="/checkout"
                                className="flex-1" /* This makes the link occupy the same width as the first button */
                            >
                                <button className="w-full h-full bg-main-brown text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-110 active:scale-95 transition-all truncate px-2">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
// Example for having different mobile and desktop layouts. Since this page is so different depending on screen size
export default function ProductDetails({ item }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout item={item} />;
  }

  return <DesktopLayout item={item} />;
}

// Then define your two different layouts below...
function MobileLayout({ item }) { 
  return (
    <div className="bg-pink-100 p-2">
    </div>
  )
}

function DesktopLayout({ item }) { 
  return (
    <div className="bg-white p-20 flex">
    </div>
  )
}

*/


export async function getStaticPaths() {
    const paths = Object.values(itemsData).map((item) => ({
        params: { slug: item.item_name.toLowerCase().replaceAll(' ', '_') }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const item = Object.values(itemsData).find(
        (i) => i.item_name.toLowerCase().replaceAll(' ', '_') === params.slug
    );

    return { 
        props: { item } 
    };
}