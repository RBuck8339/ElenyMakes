import React, {useState} from 'react'
import {updateCart} from '../logic/updateCart';

export default function Item({ item }) {
    if (!item) return null;

    const images = [
        '/gallery/tmp1.jpg',
        '/gallery/tmp2.jpg',
        '/gallery/tmp3.jpg'
    ]  // Will change this at some point to grab from a database

    const [currIdx, setCurrIdx] = useState(0);

    // Controls the carousel
    const nextImage = () => {
        setCurrIdx((prevIdx) => (prevIdx + 1) % images.length);
    }
    const prevImage = () => {
        setCurrIdx((prevIdx) => (prevIdx - 1 + images.length) % images.length);
    }

    const [inCart, setInCart] = useState(false);

    const updateCartHandler = () => {
        updateCart(item.id, !inCart);
        console.log(item.id);
        console.log(!inCart);
        setInCart(prev => !prev);
    };

    return (
        <div className="flex flex-col bg-main-pink rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <div className="relative group aspect-square w-full bg-gray-200">
                <img
                    src={images[currIdx]}
                    alt={`Slide ${currIdx}`}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={prevImage}
                        disabled={currIdx === 0}
                        className={`flex bg-neutral-accent hover:bg-white p-2 rounded-full text-center items-center  text-main-brown shadow-sm ${currIdx === 0 ? 'invisible' : ''}`}
                    >
                        {'<'}
                    </button>
                    <button 
                        onClick={nextImage}
                        disabled={currIdx === images.length - 1}
                        className={`flex bg-white/80 hover:bg-white p-2 rounded-full text-center items-center  text-main-brown shadow-sm ${currIdx === images.length - 1 ? 'invisible' : ''}`}
                    >
                        {'>'}
                    </button>
                </div>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === currIdx ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                </div>
            </div>

            <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="mb-4">
                    <h2 className="text-main-brown font-bold text-lg truncate">{item.item_name}</h2>
                    <p className="text-main-brown/70 font-semibold">${item.price}</p>
                </div>
                
                <div className="flex flex-row gap-2 h-1/2">
                    <button className="w-full border border-main-brown text-main-brown py-2 rounded-lg font-medium hover:bg-main-brown/5 transition-colors text-sm">
                        View Details
                    </button>
                    <button className="w-full bg-main-brown text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    onClick={updateCartHandler}>
                        <img className="w-full h-full p-3" 
                        src={!inCart ? '/icons/cart_plus.png' : '/icons/cart_minus.png'}/>
                    </button>
                    
                </div>
            </div>
        </div>
    );
}