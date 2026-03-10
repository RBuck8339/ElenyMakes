import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/header';
import Carousel from '../../components/carousel';
import {updateCart} from '../../logic/updateCart';
import useIsMobile from '../../logic/useIsMobile';


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
    if (!item) return <div>Product not found</div>;
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

    const isMobile = useIsMobile();

    if(isMobile){
        return <MobileView item={item} inCart={inCart} handleCartToggle={handleCartToggle} itemImages={itemImages}/>
    }
    else{
        return <DesktopView item={item} inCart={inCart} handleCartToggle={handleCartToggle} itemImages={itemImages}/>
    }
}



function MobileView({ item, inCart, handleCartToggle, itemImages }) { 
    if (!item) return null;
    return (
    <div className="flex flex-col min-h-screen bg-background w-full overflow-y-auto">
        <Header />
        
        <div className="flex flex-col w-full mt-16 p-6 gap-6 mx-auto pb-12">
            
            {/* Carousel Section */}
            <div className="w-full flex justify-center items-center">
                <div className="bg-main-pink rounded-3xl w-full max-w-sm aspect-square p-2 flex items-center justify-center shadow-sm border-1 border-accent-green overflow-hidden">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                        <Carousel images={itemImages} className="w-full h-full" />
                    </div>  
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full flex flex-col space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-espresso leading-tight">{item.item_name}</h1>
                    <p className="text-xs font-bold text-text-espresso/40 uppercase tracking-[0.2em] mt-1">
                        {`${item.item_type} Pattern` || 'Original Design'}
                    </p>
                </div>
        
                <p className="text-2xl font-semibold text-accent-green">${Number(item.price).toFixed(2)}</p>
                
                <div className="space-y-1">
                    <h3 className="font-bold text-text-espresso text-sm">Description:</h3>
                    <p className="text-text-espresso/80 leading-relaxed text-sm">
                        {item.item_description || "Handcrafted with love."}
                    </p>
                </div>

                {/* Materials & Colors - Now with Color Boxes restored */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-main-brown/5">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-text-espresso mb-1 text-xs uppercase tracking-wider">Materials</h3>
                        <ul className="list-disc pl-4 text-xs text-text-espresso/70 space-y-1">
                            {(item.materials || []).map((material, index) => (
                                <li key={index}>{material}</li>
                            ))}
                        </ul>
                    </div>

                    {item.colors?.length > 0 && (
                        <div className="flex flex-col">
                            <h3 className="font-bold text-text-espresso mb-1 text-xs uppercase tracking-wider">Colors</h3>
                            <ul className="flex flex-wrap gap-1.5">
                                {item.colors.map((color, index) => {
                                    const pureColor = COLOR_MAP[color] || "#F9F6F3";
                                    const lightColor = getLightVersion(pureColor);
                                    const isDark = ["Black", "Dark Grey"].includes(color);

                                    return (
                                        <li 
                                            key={index} 
                                            className="px-2 py-0.5 rounded border border-main-brown/10 text-[10px] font-medium 
                                                       transition-all duration-300 uppercase tracking-tighter"
                                            style={{ 
                                                backgroundColor: lightColor,
                                                color: "inherit"
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

                {/* The Stable Button Row */}
                <div className="flex flex-row gap-3 w-full pt-4 min-h-[64px]">
                    {item.pattern_exists === true ? (
                            <>
                                <button 
                                    className={`bg-other-pink1 text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-105 active:scale-95 transition-all truncate px-2 ${inCart ? 'flex-1' : 'w-full'}`}
                                    onClick={handleCartToggle}
                                >
                                    {inCart ? "Remove from Cart" : "Add to Cart"}
                                </button>
                                
                                {inCart && (
                                    <Link
                                        href="/checkout"
                                        className="flex-1 bg-main-brown text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center px-2"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                )}
                            </>
                        ) : (
                            <button 
                                disabled
                                className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg md:text-xl cursor-not-allowed opacity-75"
                            >
                                Pattern Coming Soon
                            </button>
                        )}
                </div>
            </div>
        </div>
    </div>
  );
}


function DesktopView({ item, inCart, handleCartToggle, itemImages }) { 
    if (!item) return null;
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
                        <p className="text-sm font-bold text-text-espresso/50 uppercase tracking-widest">{`${item.item_type} Pattern` || 'Original Design'}</p>
                    </div>

                    <p className="text-4xl font-semibold text-accent-green">${Number(item.price).toFixed(2)}</p>
                    
                    <div className="max-w-xl">
                        <h3 className="font-bold text-text-espresso mb-2 text-lg">Description:</h3>
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
                        {item.pattern_exists === true ? (
                            <>
                                <button 
                                    className={`bg-other-pink1 text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-105 active:scale-95 transition-all truncate px-2 ${inCart ? 'flex-1' : 'w-full'}`}
                                    onClick={handleCartToggle}
                                >
                                    {inCart ? "Remove from Cart" : "Add to Cart"}
                                </button>
                                
                                {inCart && (
                                    <Link
                                        href="/checkout"
                                        className="flex-1 bg-main-brown text-white py-4 rounded-xl font-bold text-lg md:text-xl shadow-md hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center px-2"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                )}
                            </>
                        ) : (
                            <button 
                                disabled
                                className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg md:text-xl cursor-not-allowed opacity-75"
                            >
                                Pattern Coming Soon
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



export async function getStaticPaths(context) {
    const { env } = context;
    
    try {
        // Query D1 for all existing slugs
        const { results } = await env.DB.prepare("SELECT slug FROM products").all();
        
        const paths = results.map((product) => ({
            params: { slug: product.slug }
        }));

        return { paths, fallback: 'blocking' }; 
    } catch (error) {
        console.error("D1 paths error:", error);
        return { paths: [], fallback: 'blocking' };
    }
}

export async function getStaticProps({ params, env }) {
    try {
        // Fetch single product from D1
        const item = await env.DB.prepare(
            "SELECT * FROM products WHERE slug = ?"
        )
        .bind(params.slug)
        .first();

        if (!item) {
            return { notFound: true };
        }

        // Parse JSON strings back into arrays and handle Boolean
        const formattedItem = {
            ...item,
            images: JSON.parse(item.images || "[]"),
            materials: JSON.parse(item.materials || "[]"),
            colors: JSON.parse(item.colors || "[]"),
            pattern_exists: Boolean(item.pattern_exists)
        };

        return { 
            props: { item: formattedItem } 
        };
    } catch (err) {
        console.error("D1 props error:", err);
        return { notFound: true };
    }
}