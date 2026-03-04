import React, { useState } from 'react';
import Image from 'next/image';

export default function Carousel({ images }) {
    const [currIdx, setCurrIdx] = useState(0);

    // Fallback logic for images
    const displayImages = images?.length > 0 ? images : ['/gallery/tmp1.jpg'];

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        if (currIdx < displayImages.length - 1) {
            setCurrIdx(prev => prev + 1);
        }
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        if (currIdx > 0) {
            setCurrIdx(prev => prev - 1);
        }
    };

    /* For mobile swiping */
    const [touchStart, setTouchStart] = useState(null);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;

        if (distance > 50) nextImage(e); // Swiped left
        if (distance < -50) prevImage(e); // Swiped right
        setTouchStart(null);
    };

    return (
        /* w-full sets the width, and aspect-square forces the height to match it perfectly */
        <div className="relative group w-full aspect-square bg-transparent overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
            
            {/* The Image: absolute + h-full + w-full + object-cover makes it fit the square without distortion */}
            <div className="relative w-full h-full"> 
                <Image
                    src={displayImages[currIdx]}
                    alt={`Slide ${currIdx}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw" // Helps Next.js optimize the size
                    className="object-cover rounded-2xl"
                    priority={currIdx === 0} // Loads the first slide immediately
                />
            </div>

            {/* UI Overlay (Arrows and Dots) */}
            {displayImages.length > 1 && (
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                    
                    {/* Navigation Arrows */}
                    <div className="flex-1 flex items-center justify-between px-2 
                                    opacity-30 md:opacity-0 md:group-hover:opacity-80 
                                    transition-opacity duration-300 pointer-events-auto">
                        
                        <button
                            onClick={prevImage}
                            disabled={currIdx === 0}
                            className={`bg-white/90 hover:bg-white p-2 rounded-full text-main-brown shadow-lg 
                                    transition-all active:scale-90
                                    ${currIdx === 0 ? 'invisible opacity-0' : 'visible opacity-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>

                        <button
                            onClick={nextImage}
                            disabled={currIdx === displayImages.length - 1}
                            className={`bg-white/90 hover:bg-white p-2 rounded-full text-main-brown shadow-lg 
                                    transition-all active:scale-90
                                    ${currIdx === displayImages.length - 1 ? 'invisible opacity-0' : 'visible opacity-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>

                    {/* Indicator Dots */}
                    <div className="h-8 flex items-center justify-center gap-1 pointer-events-auto">
                        {displayImages.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 w-1.5 rounded-full shadow-sm transition-colors ${i === currIdx ? 'bg-white' : 'bg-white/40'}`} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}