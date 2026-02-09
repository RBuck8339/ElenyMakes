import React, {useState, useEffect} from 'react';

export default function Cart() {
    const [cartIds, setCartIds] = useState([]);
    
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

    return (
        <div className="w-[95vw] md:w-1/3 min-h-[200px] max-h-[80vh] flex flex-col bg-neutral-accent border-2 border-accent-green shadow-2xl rounded-lg overflow-hidden p-3 m-3">
            
            {/* Header */}
            <div className="p-4 border-b border-accent-green/30 bg-white/50">
                <h2 className="font-bold text-lg text-main-brown">Your Items</h2>
            </div>

            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                {cartIds.length > 0 ? (
                    <div className="space-y-2">
                        {/* Map through your IDs here later */}
                        <p className="text-main-brown">You have {cartIds.length} items.</p>
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
                <button className="w-full bg-main-brown text-white py-3 rounded-md font-bold hover:brightness-110 transition-all shadow-md active:scale-95">
                    Checkout Now
                </button>
            </div>
        </div>
    );
}