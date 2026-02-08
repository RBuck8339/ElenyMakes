import React, {useState} from 'react';
import Cart from '../components/cart';


export default function Header() {
    const [cartOpen, changeCartOpen] = useState(false);
    
    const toggleCart = () => {
        changeCartOpen(prev => !prev);
    }

    return (
        <div className="fixed top-0 left-0 w-full z-[100] flex flex-col">
            
            <div className="flex flex-row justify-end items-center bg-main-brown h-16 px-4">
                <button onClick={toggleCart} className="h-full py-3">
                    <img 
                        className="h-full w-auto object-contain" 
                        src="icons/cart.png" 
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