import Header from "../components/header";
import PayPalBtn from "../components/paypalbtn";
import Disclaimer from "../components/disclaimer";
import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateCart } from '../logic/updateCart';


export default function Checkout(){
    const [cartIds, setCartIds] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerEmail, setCustomerEmail] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    
    const getImage = (item) => {
        if (!item || !item.images || item.images.length === 0) {
            return '/gallery/placeholder.webp'; 
        }
        const path = item.images[0];
        return path.startsWith('/') ? path : `/${path}`;
    };

    useEffect(() => {
        const refreshCart = () => {
            const stored = localStorage.getItem('cart_ids');
            setCartIds(stored ? JSON.parse(stored) : []);
        };

        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch from your Cloudflare-backed API route
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data) {
                    setAllProducts(data);
                }
            } catch (err) {
                console.error("Checkout fetch error:", err);
            }
            setLoading(false);
        }

        refreshCart();
        fetchProducts();

        window.addEventListener('updateCart', refreshCart);
        return () => window.removeEventListener('updateCart', refreshCart);
    }, []);

    const handleEmailChange = (event) => {
        setCustomerEmail(event.target.value);
    }

    const cartItems = allProducts.filter(item => cartIds.includes(item.id));
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const pdfNames = cartItems.map(item => item.slug);

    const isValidEmail = customerEmail.includes('@') && customerEmail.includes('.');
    const showEmailError = isTouched && !isValidEmail && customerEmail !== '';

    return (
        <div className="block">
            <div className="bg-background min-h-screen w-full">
                <Header />
                <div className="flex flex-row min-h-screen w-full pt-16 justify-center">
                    <div className="w-full md:w-2/3 flex flex-col p-8 gap-5">
                        <div className="bg-neutral-accent border-2 border-accent-green rounded-lg p-3 m-2">
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
                                                <div className="h-16 w-16 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                    <Image 
                                                        src={getImage(item)} 
                                                        alt={item.item_name}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover"
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

                            <hr className="border-t border-main-brown my-4"/>
                            <h3 className="font-primary text-xl text-text-espresso"><u>Order Destination:</u></h3>
                            <div className="w-full">
                                <input 
                                    type="email"
                                    placeholder="Where should we send your patterns?"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    // 1. This triggers when the user clicks AWAY (not focus)
                                    onBlur={() => setIsTouched(true)} 
                                    className={`w-full p-4 rounded-xl border-2 border-accent-green/30 bg-white/50 outline-none transition-all font-secondary focus:bg-white
                                        ${showEmailError ? 'border-red-400 bg-red-50' : 'border-main-pink/20 focus:border-accent-green'}
                                    `}
                                />
                                
                                {showEmailError && (
                                    <p className="text-xs text-center text-red-500 mt-2 animate-pulse">
                                        Oops! That doesn't look like a valid email.
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-row justify-between mt-3">
                                <h2 className="font-primary text-xl text-text-espresso">Total Price:</h2>
                                <h2 className="font-primary text-xl text-text-espresso"><u>${totalPrice.toFixed(2)}</u></h2>
                            </div>
                            <div className="relative mt-4">
                                {/* Visual overlay to prevent clicks and show "disabled" state */}
                                {!isValidEmail && (
                                    <div className="absolute inset-0 z-10 bg-white/50 cursor-not-allowed flex items-center justify-center rounded-xl">
                                        <p className="text-main-brown font-bold bg-white/80 px-4 py-2 rounded-lg shadow-sm border border-main-pink">
                                            Enter email to unlock payment
                                        </p>
                                    </div>
                                )}
                                
                                <div className={!isValidEmail ? "opacity-40 grayscale" : "opacity-100"}>
                                    <PayPalBtn 
                                        amount={totalPrice} 
                                        items={pdfNames} 
                                        email={customerEmail} 
                                        receiptItems={cartItems}
                                    />
                                </div>
                            </div>
                        </div>
                        <Disclaimer />
                    </div>
                </div>
            </div>
        </div>
    );
}