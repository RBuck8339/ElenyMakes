import React, { useState } from 'react';

export default function Carousel({ images }) {
    const [currIdx, setCurrIdx] = useState(0);

    // Fallback logic for images
    const displayImages = images?.length > 0 ? images : ['/gallery/tmp1.jpg'];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrIdx((prevIdx) => (prevIdx + 1) % displayImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrIdx((prevIdx) => (prevIdx - 1 + displayImages.length) % displayImages.length);
    };

    return (
        /* w-full sets the width, and aspect-square forces the height to match it perfectly */
        <div className="relative group w-full aspect-square bg-gray-200 overflow-hidden">
            
            {/* The Image: absolute + h-full + w-full + object-cover makes it fit the square without distortion */}
            <img
                src={displayImages[currIdx]}
                alt={`Slide ${currIdx}`}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* UI Overlay (Arrows and Dots) */}
            {displayImages.length > 1 && (
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                    
                    {/* Navigation Arrows */}
                    <div className="flex-1 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <button
                            onClick={prevImage}
                            disabled={currIdx === 0}
                            className={`bg-white/80 hover:bg-white p-2 rounded-full text-main-brown shadow-md ${currIdx === 0 ? 'invisible' : ''}`}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={nextImage}
                            disabled={currIdx === displayImages.length - 1}
                            className={`bg-white/80 hover:bg-white p-2 rounded-full text-main-brown shadow-md ${currIdx === displayImages.length - 1 ? 'invisible' : ''}`}
                        >
                            {'>'}
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