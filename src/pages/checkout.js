import { React } from "react";
import Header from "../components/header";


export default function Checkout(){
    
    return (
        <div className="bg-background min-h-screen flex">
            <Header />
            <div className="flex flex-row min-h-screen">
                {/* Left Side: Show off the users items */}
                <div className="w-1/2 flex flex-col bg-accent-pink">
                </div>

                {/* Right Side: Checkout form with PayPal */}
                <div className="w-1/2 flex flex-col bg-neutral-accent">
                </div>
            </div>
        </div>
    );
}