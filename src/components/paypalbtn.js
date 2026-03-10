import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PayPalBtn({ amount, items, email, receiptItems }) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const initialOptions = {
        "client-id": process.env.NEXT_PUBLIC_USE_SANDBOX === 'true' 
            ? process.env.NEXT_PUBLIC_SANDBOX_PAYPAL_CLIENT_ID 
            : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        "disable-funding": "paylater",
        "enable-funding": "venmo"
    };

    const fulfillOrder = async (orderId) => {
        setIsProcessing(true);
        try {
            await Promise.all([
                // LOG ORDER
                fetch('/api/logOrder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paypalId: orderId,
                        email: email,
                        amount: amount,
                        items: items
                    })
                }),
                fetch('/api/productDelivery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items,
                        user_email: email,
                        orderId: orderId
                    })
                }),
                fetch('/api/sendReceipt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: receiptItems,
                        orderId: orderId,
                        user_email: email
                    })
                })
            ]);

            localStorage.removeItem('cart_ids');
            window.dispatchEvent(new Event('updateCart'));
            router.push(`/success?orderId=${orderId}`);

        } catch (err) {
            console.error("Fulfillment error:", err);
            setIsProcessing(false);
            alert("Delivery encountered an error. Please contact support.");
        }
    };

    const onApprove = async (data, actions) => {
        const details = await actions.order.capture();
        await fulfillOrder(details.id);
    };

    const onError = (err) => {
        console.error("PayPal checkout error:", err);
        setIsProcessing(false);
    };

    const handleFreeOrder = async () => {
        if (!email || !email.includes('@')) {
            return alert("Please enter a valid email address first!");
        }
        // Generate a simple unique ID for free orders
        const freeId = `FREE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await fulfillOrder(freeId);
    };

    return (
        <div className="relative z-10 w-full max-w-md mx-auto mt-8 flex flex-col items-center">
            {isProcessing && (
                <div className="absolute inset-0 z-20 bg-white/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-accent-green border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-secondary text-text-espresso">Sending your patterns...</p>
                </div>
            )}

            {amount > 0 ? (
                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons 
                        style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                        className="w-full"
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                    />
                </PayPalScriptProvider>
            ) : items.length > 0 ? ( // Fixed: Braces removed from here
                <button 
                    className="w-full group relative px-8 py-4 bg-accent-green border-2 border-main-brown rounded-xl font-primary text-text-espresso transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:text-white active:translate-y-0"
                    onClick={handleFreeOrder}
                >
                    <span className="relative z-10 font-bold"><u>Get My Free Patterns</u></span>
                </button>
            ) : ( // Fixed: Braces removed from here
                <></>
            )}
        </div>
    );
}