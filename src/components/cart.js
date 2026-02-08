import React, {useState, useEffect} from 'react';

export default function Cart(){
    const [cartIds, setCartIds] = useState([]);
    
    // Get items in cart
    const refreshCart = () => {
        setCartIds(JSON.parse(localStorage.getItem('cart_ids')) || []);
    }

    useEffect(() => {
        refreshCart();

        window.addEventListener('updateCart', refreshCart);

        return () => window.removeEventListener('updateCart', refreshCart);
    }, []);

    return (
        <div className="w-[95vw] md:w-1/3 
                        min-h-[200px] max-h-[80vh] 
                        flex flex-col
                        bg-neutral-accent border-2 border-accent-green 
                        shadow-2xl rounded-lg overflow-hidden p-3 m-3">
            
            {/* Header of the dropdown */}
            <div className="p-4 border-b border-accent-green/30 bg-white/50">
                <h2 className="font-bold text-lg text-main-brown">Your Items</h2>
            </div>

            {/* Scrollable area for items */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                {
                    cartIds.length > 0 ? 
                    (<p>Have items</p>) :
                    (<p className="text-sm text-gray-500 italic">Your cart is currently empty...</p>)
                }
                {/* Suggest some 'hot' items for the user if cart is empty */}
            </div>

            {/* Footer / Checkout Button */}
            <div className="p-4 bg-neutral-accent border-t border-accent-green/30">
                <button className="w-full bg-main-brown text-white py-3 rounded-md font-bold hover:brightness-110 transition-all">
                    Checkout Now
                </button>
            </div>
        </div>
    );
}