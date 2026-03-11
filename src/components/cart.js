import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateCart } from '../logic/updateCart';

export default function Cart({ closeCart }) {
    const [cartIds, setCartIds] = useState([]);
    const [allProducts, setAllProducts] = useState([]); 
    const cartRef = useRef(null);

    useEffect(() => {
        const refreshCart = () => {
            const stored = localStorage.getItem('cart_ids');
            setCartIds(stored ? JSON.parse(stored) : []);
        };

        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                
                const rawResults = Array.isArray(data) && data[0]?.results 
                    ? data[0].results 
                    : (Array.isArray(data) ? data : []);

                const formattedProducts = rawResults.map(p => ({
                    ...p,
                    images: typeof p.images === 'string' ? JSON.parse(p.images || "[]") : (p.images || []),
                    id: Number(p.id)
                }));

                setAllProducts(formattedProducts);
            } catch (err) {
                console.error("Cart fetch error:", err);
            }
        };

        // --- CLICK OUTSIDE HANDLER ---
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                closeCart();
            }
        };

        refreshCart();
        fetchProducts();

        window.addEventListener('updateCart', refreshCart);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('updateCart', refreshCart);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeCart]);

    const getImage = (item) => {
        // Safe check for parsed images array
        if (!item || !item.images || !Array.isArray(item.images) || item.images.length === 0) {
            return '/gallery/placeholder.webp'; 
        }
        const path = item.images[0];
        return path.startsWith('/') ? path : `/${path}`;
    };

    const cartItems = allProducts.filter(item => 
        cartIds.map(Number).includes(Number(item.id))
    );   

    return (
        <div ref={cartRef} className="w-[95vw] md:w-1/3 min-h-[200px] max-h-[80vh] flex flex-col bg-neutral-accent border-2 border-accent-green shadow-2xl rounded-lg overflow-hidden p-3 m-3">
            <div className="p-3 border-b border-accent-green/30 bg-white/50">
                <h2 className="font-primary text-xl text-text-espresso">Your Items</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white">
                {cartItems.length > 0 ? (
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0">
                                <div className="h-16 w-16 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                    <Image 
                                        src={getImage(item)} 
                                        alt={item.item_name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link 
                                        href={`/product/${item.slug}`}
                                        className="w-full"
                                        onClick={() => closeCart && closeCart()}
                                    >
                                        <h3 className="font-primary text-text-espresso text-sm truncate hover:underline">
                                            {item.item_name}
                                        </h3>
                                    </Link>
                                    <p className="font-secondary text-xs text-gray-500 truncate">
                                        Standard Size
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm font-secondary text-accent-green">
                                            ${Number(item.price).toFixed(2)}
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
                        <p className="text-sm text-gray-500 italic">Your cart is currently empty...</p>
                    </div>
                )}
            </div>

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