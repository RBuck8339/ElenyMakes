import React, {useState} from 'react';
import Cart from '../components/cart';
import Link from 'next/link';

export default function Header() {
    const [cartOpen, changeCartOpen] = useState(false);
    
    const toggleCart = () => {
        changeCartOpen(prev => !prev);
    }

    return (
        <div className="fixed top-0 left-0 w-full z-100 flex flex-col">
            
            <div className="relative flex flex-row items-center bg-accent-pink h-16 px-4
                border-t border-white/20 
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                <div className="flex-1"/>
                <Link 
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 flex items-center h-full group transition-transform active:scale-95"
                >
                    <h1 
                        className="text-text-espresso text-4xl md:text-5xl text-center leading-none select-none
                                py-2 group-hover:text-main-brown transition-colors cursor-pointer" // py-2 adds the padding you want
                        style={{ 
                            fontFamily: "'Monsieur La Doulaise', cursive",
                            filter: "drop-shadow(0px 2px 2px rgba(83, 54, 56, 0.2))" 
                        }}
                    >
                        Eleny Makes
                    </h1>
                </Link> 
                <button onClick={toggleCart} className="h-full py-3">
                    <img 
                        className="h-full w-auto object-contain" 
                        src="/icons/cart.svg" 
                        alt="Cart"
                    />
                </button>
            </div>
            {cartOpen && (
                <div className="absolute top-16 left-0 right-0 w-full flex justify-end px-4">
                    <Cart closeCart={() => changeCartOpen(false)}/>
                </div>
            )}
        </div>
    )
}