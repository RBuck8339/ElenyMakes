import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import itemsData from '../../items.json';
import { updateCart } from '../logic/updateCart';

export default function Cart({ closeCart }) {
    const [cartIds, setCartIds] = useState([]);
    const cartRef = useRef(null);
    
    const getImage = (item) => {
        if (!item) return '/gallery/tmp1.jpg';  // Fallback image

        let imagePath = '';

        if (item.images && item.images.length > 0){
            imagePath = item.images[0];
        }
        else{
            imagePath = '/gallery/tmp1.jpg';
        }
        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    }

    useEffect(() => {
        // defined inside useEffect so it has access to latest scope if needed
        const refreshCart = () => {
            // Safety check for null (just in case)
            const stored = localStorage.getItem('cart_ids');
            setCartIds(stored ? JSON.parse(stored) : []);
        };

        // 1. Run immediately on mount
        refreshCart();

        // 2. Listen for updates
        window.addEventListener('updateCart', refreshCart);

        // 3. Cleanup
        return () => window.removeEventListener('updateCart', refreshCart);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                if (closeCart) closeCart();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeCart]);

    const cartItems = Object.values(itemsData).filter(item => cartIds.includes(item.id));
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div ref={cartRef} className="w-[95vw] md:w-1/3 min-h-[200px] max-h-[80vh] flex flex-col bg-neutral-accent border-2 border-accent-green shadow-2xl rounded-lg overflow-hidden p-3 m-3">
            
            {/* Header */}
            <div className="p-3 border-b border-accent-green/30 bg-white/50">
                <h2 className="font-primary text-xl text-text-espresso">Your Items</h2>
            </div>

            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                {cartIds.length > 0 ? (
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            // RENDER EACH ITEM
                            <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0">
                                
                                {/* IMAGE THUMBNAIL */}
                                <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                    <img 
                                        src={getImage(item)} 
                                        alt={item.item_name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* ITEM DETAILS */}
                                <div className="flex-1 min-w-0"> {/* min-w-0 fixes text truncation */}
                                    <Link 
                                        href={{
                                            pathname: '/product/[slug]', 
                                            query: { slug: item.item_name.toLowerCase().replaceAll(' ', '_') },
                                        }}
                                        className="w-full"
                                        onClick={() => closeCart && closeCart()}
                                    >
                                        <h3 className="font-primary text-text-espresso text-sm truncate hover:underline">
                                            {item.item_name}
                                        </h3>
                                    </Link>
                                    <p className="font-secondary text-xs text-gray-500 truncate">
                                        {item.id === 0 ? "Size A": "Standard Size"}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm font-secondary text-accent-green">
                                            ${item.price.toFixed(2)}
                                        </span>
                                        <button 
                                            className="font-secondary text-xs text-red-400 hover:text-red-600 underline"
                                            onClick={() => updateCart(item.id, false)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                         {/* Optional: Add a sad yarn ball icon here */}
                        <p className="text-sm text-gray-500 italic">Your cart is currently empty...</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-accent border-t border-accent-green/30">
                <Link 
                    href="/checkout" 
                    onClick={() => closeCart && closeCart()}
                    className="block text-center font-secondary font-semibold w-full bg-main-brown text-white py-2.5 rounded-md hover:brightness-110 transition-all shadow-md active:scale-95"
                >
                    Checkout Now
                </Link>
            </div>
        </div>
    );
}