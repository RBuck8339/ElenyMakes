import React, { useState, useEffect } from 'react'
import { updateCart } from '../logic/updateCart';
import Link from 'next/link';
import Carousel from '../components/carousel';

export default function Item({ item }) {
    if (!item) return null;
    const itemSlug = item.item_name.toLowerCase().replaceAll(' ', '_');
    const itemImages = item.images?.length > 0 
        ? item.images.map(img => img.startsWith('/') ? img : `/${img}`)
        : [];
    
    // FIX 1: Initialize as false (safe for server)
    const [inCart, setInCart] = useState(false);

    // FIX 2: Check localStorage only on the client side
    useEffect(() => {
        // Check once on load
        const checkCartStatus = () => {
            const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]");
            setInCart(currentCart.includes(item.id));
        };
        checkCartStatus();

        // FIX 3: Listen for the 'updateCart' event we made earlier
        // This ensures if you add an item in the "Details" page, this button updates automatically!
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
        <div className="flex flex-col bg-main-pink rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-3">
                <Carousel images={itemImages} />
            </div>

            {/* Increased padding to p-4 for breathing room */}
            <div className="p-4 flex flex-col gap-3">
                {/* Product Info */}
                <div>
                    <h2 className="text-text-espresso font-primary font-semibold text-xl truncate">{item.item_name}</h2>
                    <p className="text-text-espresso/60 font-secondary">${item.price}</p>
                </div>
                
                {/* Button Stack */}
                <div className="flex flex-col gap-2 w-full"> 
                    {/* Primary Action: View Details */}
                    <Link 
                        href={{
                            pathname: '/product/[slug]', 
                            query: { slug: itemSlug },
                        }}
                        className="w-full"
                    >
                        <button className="w-full bg-main-brown font-secondary text-white py-2 rounded-lg hover:bg-main-brown/85 transition-all text-sm shadow-shadow-[3px_8px_12px_-4px_#B3C8BA] active:scale-[0.98]">
                            View Details
                        </button>
                    </Link>

                    {/* Secondary Action: Add to Cart */}
                    <button 
                        className={`w-full py-2 rounded-lg font-secondary transition-all flex items-center justify-center gap-2 text-sm border ${
                            inCart 
                            ? "bg-white border-red-200 text-main-brown hover:bg-neutral-accent hover:border-main-brown hover-border-1" 
                            : "bg-white border-main-brown/20 text-main-brown hover:bg-neutral-accent hover:border-main-brown hover-border-1"
                        }`}
                        onClick={handleCartToggle}
                    >
                        <img 
                            className={`w-7 h-5 ${inCart ? "" : "opacity-70"}`} 
                            src={!inCart ? '/icons/cart_plus.svg' : '/icons/cart_minus.svg'} 
                            alt="Cart icon"
                        />
                        {inCart ? "Remove from Cart" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}