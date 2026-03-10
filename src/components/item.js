import React, { useState, useEffect } from 'react';
import { updateCart } from '../logic/updateCart';
import Link from 'next/link';
import Image from 'next/image'; // For optimization
import Carousel from '../components/carousel';

export default function Item({ item }) {
    if (!item) return null;

    const itemSlug = item.slug; 
    
    // Ensure image paths work with the public folder
    const itemImages = item.images?.length > 0 
        ? item.images.map(img => img.startsWith('/') ? img : `/${img}`)
        : [];
    
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        const checkCartStatus = () => {
            const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]");
            setInCart(currentCart.includes(item.id));
        };
        checkCartStatus();

        window.addEventListener('updateCart', checkCartStatus);
        return () => window.removeEventListener('updateCart', checkCartStatus);
    }, [item.id]);

    const handleCartToggle = (e) => {
        e?.stopPropagation(); 
        const newState = !inCart;
        updateCart(item.id, newState);
        setInCart(newState); 
    };

    return (
        <div className="flex flex-col bg-main-pink rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="p-3">
                {/* Carousel will still handle internal image rendering */}
                <Carousel images={itemImages} />
            </div>

            <div className="p-4 flex flex-col gap-3">
                <div>
                    <h2 className="text-text-espresso font-primary font-semibold text-xl truncate">
                        {item.item_name}
                    </h2>
                    <p className="text-text-espresso/60 font-secondary">
                        ${item.price.toFixed(2)}
                    </p>
                </div>
                
                <div className="flex flex-col gap-2 w-full"> 
                    {/* Primary Action: View Details using the DB SLUG */}
                    <Link 
                        href={`/product/${itemSlug}`}
                        className="w-full bg-main-brown font-secondary text-white py-2 rounded-lg hover:bg-main-brown/85 transition-all text-sm flex items-center justify-center shadow-md active:scale-[0.98]"
                    >
                        View Details
                    </Link>

                    {/* Secondary Action: Add to Cart */}
                    {item.pattern_exists === true ? (
                        <>
                            <button 
                                className={`w-full py-2 rounded-lg font-secondary transition-all flex items-center justify-center gap-2 text-sm border ${
                                    inCart 
                                    ? "bg-white border-red-200 text-main-brown" 
                                    : "bg-white border-main-brown/20 text-main-brown"
                                } hover:bg-neutral-accent hover:border-main-brown`}
                                onClick={handleCartToggle}
                            >
                                {/* Use Next.js Image for the icon */}
                                <div className="relative w-6 h-5">
                                    <Image 
                                        src={!inCart ? '/icons/cart_plus.svg' : '/icons/cart_minus.svg'} 
                                        alt="Cart icon"
                                        fill
                                        className={`object-contain ${inCart ? "" : "opacity-70"}`}
                                    />
                                </div>
                                {inCart ? "Remove" : "Add to Cart"}
                            </button>
                        </>
                    ) : (
                        <button 
                            disabled

                            className="w-full py-2 rounded-lg font-secondary transition-all flex items-center justify-center gap-2 text-sm border bg-white border-main-brown/20 text-gray-800 opacity-75 cursor-not-allowed"
                        >
                            Pattern Coming Soon
                        </button>
                    )}
                    
                </div>
            </div>
        </div>
    );
}