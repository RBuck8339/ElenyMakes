import React, { useState, useEffect } from 'react'
import { updateCart } from '../logic/updateCart';
import Link from 'next/link';

export default function Item({ item }) {
    if (!item) return null;
    const itemSlug = item.item_name.toLowerCase().replaceAll(' ', '_');
    let images = [];
    if (item.images && item.images.length > 0) {
        images = item.images.map(img => img.startsWith('/') ? img : `/${img}`);
    }
    else {
            images = [
            '/gallery/tmp1.jpg',
            '/gallery/tmp2.jpg',
            '/gallery/tmp3.jpg'
        ];
    }

    const [currIdx, setCurrIdx] = useState(0);
    
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

    // Controls the carousel
    const nextImage = (e) => {
        e.stopPropagation(); // Prevent clicking the image from triggering parent clicks
        setCurrIdx((prevIdx) => (prevIdx + 1) % images.length);
    }
    const prevImage = (e) => {
        e.stopPropagation();
        setCurrIdx((prevIdx) => (prevIdx - 1 + images.length) % images.length);
    }
    
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
            <div className="relative group aspect-square w-full bg-gray-200">
                <img
                    src={images[currIdx]}
                    alt={`Slide ${currIdx}`}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={prevImage}
                        disabled={currIdx === 0}
                        className={`flex bg-neutral-accent hover:bg-white p-2 rounded-full text-center items-center text-main-brown shadow-sm ${currIdx === 0 ? 'invisible' : ''}`}
                    >
                        {'<'}
                    </button>
                    <button 
                        onClick={nextImage}
                        disabled={currIdx === images.length - 1}
                        className={`flex bg-white/80 hover:bg-white p-2 rounded-full text-center items-center text-main-brown shadow-sm ${currIdx === images.length - 1 ? 'invisible' : ''}`}
                    >
                        {'>'}
                    </button>
                </div>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                        <div key={i} className={`h-1 w-1 rounded-full ${i === currIdx ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                </div>
            </div>

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