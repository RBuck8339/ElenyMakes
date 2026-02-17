import React, {useState} from 'react';
import Cart from '../components/cart';


export default function Header() {
    const [cartOpen, changeCartOpen] = useState(false);
    
    const toggleCart = () => {
        changeCartOpen(prev => !prev);
    }

    return (
        <div className="fixed top-0 left-0 w-full z-[100] flex flex-col">
            
            <div className="flex flex-row justify-end items-center bg-accent-pink h-16 px-4
                border-t border-white/20 
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_6px_-1px_rgba(0,0,0,0.2)]">
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
                    <Cart />
                </div>
            )}
        </div>
    )
}