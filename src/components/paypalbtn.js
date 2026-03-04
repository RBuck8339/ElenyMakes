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

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: amount.toFixed(2),
                },
                description: "Eleny Makes Digital Crochet Patterns"
            }],
            payment_source: {
                paypal: {
                    experience_context: {
                        shipping_preference: "NO_SHIPPING",
                        user_action: "PAY_NOW",
                        brand_name: "Eleny Makes"
                    }
                }
            }
        });
    };

    const onApprove = async (data, actions) => {
        setIsProcessing(true); 

        try {
            // 1. Capture the funds
            const details = await actions.order.capture();

            // 2. Fire fulfillment requests in parallel
            // We await these so we know they finish before redirecting
            await Promise.all([
                // LOG ORDER
                fetch('/api/logOrder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paypalId: details.id,
                        email: email,
                        amount: amount,
                        items: items
                    })
                }),
                // SEND PATTERNS (Digital Delivery)
                fetch('/api/productDelivery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items,
                        user_email: email,
                        orderId: details.id
                    })
                }),
                // SEND RECEIPT (The pretty template)
                fetch('/api/sendReceipt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: receiptItems,
                        orderId: details.id,
                        user_email: email
                    })
                })
            ]);

            // 3. Cleanup & Redirect
            localStorage.removeItem('cart_ids');
            window.dispatchEvent(new Event('updateCart'));
            router.push(`/success?orderId=${details.id}`);

        } catch (err) {
            console.error("Fulfillment error:", err);
            setIsProcessing(false);
            alert("Payment confirmed, but delivery encountered an error. Please check your email or contact support.");
        }
    };

    const onError = (err) => {
        console.error("PayPal checkout error:", err);
        setIsProcessing(false);
    };

    return (
        <div className="relative flex flex-col w-full h-full justify-center items-center">
            {isProcessing && (
                <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-accent-green border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-secondary text-text-espresso">Sending your patterns...</p>
                </div>
            )}

            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons 
                    style={{ layout: "vertical", shape: "rect", color: "gold" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onClick={(data, actions) => {
                        if (!email || !email.includes('@')) {
                            alert("Please enter a valid email address first!");
                            return actions.reject();
                        }
                        return actions.resolve();
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}