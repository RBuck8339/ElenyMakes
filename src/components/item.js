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
        <div className="flex flex-col bg-main-pink rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-100 md:h-150">
            <Carousel images={itemImages} />

            <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="mb-4">
                    <h2 className="text-main-brown font-bold text-lg truncate">{item.item_name}</h2>
                    <p className="text-main-brown/70 font-bold">{item.item_type}</p>
                    <p className="text-main-brown/70 font-semibold">${item.price}</p>
                </div>
                
                <div className="flex flex-row gap-2 h-10"> {/* Fixed height for buttons */}
                    <Link 
                        href={{
                            pathname: '/product/[slug]', // Make sure this matches your folder name!
                            query: { slug: itemSlug },
                        }}
                        className="flex-1 flex"
                    >
                        <button className="w-full border border-main-brown text-main-brown py-2 rounded-lg font-medium hover:bg-main-brown/5 transition-colors text-sm">
                            View Details
                        </button>
                    </Link>
                    <button 
                        className="w-12 bg-other-pink1 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                        onClick={handleCartToggle}
                    >
                        {/* Ensure these paths exist in your public folder */}
                        <img 
                            className="w-6 h-6" 
                            src={!inCart ? '/icons/cart_plus.svg' : '/icons/cart_minus.svg'} 
                            alt={!inCart ? "Add to cart" : "Remove from cart"}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}