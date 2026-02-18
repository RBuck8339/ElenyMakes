import React from 'react';
import itemsData from '../../../items.json';
import Header from '../../components/header';
import Carousel from '../../components/carousel';

export default function ProductDetails({ item }) {
    // Get the images for the item, we will replicate the carousel from the <Item> component here
    const itemImages = item.images?.length > 0 
        ? item.images.map(img => img.startsWith('/') ? img : `/${img}`)
        : [];

    return (
        <div className="flex flex-col min-h-screen bg-background w-full">
            <Header />
            <div className="h-16 w-full"/> {/* Just here for spacing */} 
            <div className="flex flex-col md:flex-row w-full flex-1 items-center md:items-start justify-center p-10 gap-10 lg:gap-20 max-w-[1400px] mx-auto">
            
                {/* 1. Left Side: 1/3 of the screen */}
                <div className="w-full md:w-1/3 flex justify-center">
                    <div className="bg-main-pink rounded-3xl w-full max-w-md aspect-square p-2 md:p-6 flex items-center justify-center shadow-sm border-1 border-accent-green">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner">
                            <Carousel images={itemImages}/>
                        </div>  
                    </div>
                </div>

                {/* 2. Right Side: 2/3 of the screen */}
                <div className="w-full md:w-2/3 flex flex-col space-y-6 md:pt-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-main-brown mb-2">{item.item_name}</h1>
                        <p className="text-sm font-bold text-main-brown/50 uppercase tracking-widest">{item.item_type || 'Original Design'}</p>
                    </div>

                    <p className="text-3xl font-semibold text-accent-green">${item.price}</p>
                    
                    <div className="max-w-xl">
                        <h3 className="font-bold text-main-brown mb-2 text-lg">Description</h3>
                        <p className="text-main-brown/80 leading-relaxed text-lg">
                            {item.item_description || "Handcrafted with love."}
                        </p>
                    </div>

                    {/* Add to Cart Placeholder */}
                    <div className="pt-6">
                        <button className="bg-other-pink1 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-md hover:brightness-105 active:scale-95 transition-all">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
// Example for having different mobile and desktop layouts. Since this page is so different depending on screen size
export default function ProductDetails({ item }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout item={item} />;
  }

  return <DesktopLayout item={item} />;
}

// Then define your two different layouts below...
function MobileLayout({ item }) { 
  return (
    <div className="bg-pink-100 p-2">
    </div>
  )
}

function DesktopLayout({ item }) { 
  return (
    <div className="bg-white p-20 flex">
    </div>
  )
}

*/


export async function getStaticPaths() {
    const paths = Object.values(itemsData).map((item) => ({
        params: { slug: item.item_name.toLowerCase().replaceAll(' ', '_') }
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const item = Object.values(itemsData).find(
        (i) => i.item_name.toLowerCase().replaceAll(' ', '_') === params.slug
    );

    return { 
        props: { item } 
    };
}