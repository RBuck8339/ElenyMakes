import React from 'react';
import itemsData from '../../../items.json';

export default function ProductDetails({ item }) {
    // Just prints the name of the item
    return (
        <div style={{ padding: '50px', fontSize: '2rem', fontWeight: 'bold' }}>
            <h1>{item.item_name}</h1>
        </div>
    );
}

// 1. Tell Next.js what URLs to create
export async function getStaticPaths() {
    const paths = Object.values(itemsData).map((item) => ({
        params: { slug: item.item_name.toLowerCase().replaceAll(' ', '_') }
    }));

    return { paths, fallback: false };
}

// 2. Find the item that matches the URL and pass it to the component
export async function getStaticProps({ params }) {
    const item = Object.values(itemsData).find(
        (i) => i.item_name.toLowerCase().replaceAll(' ', '_') === params.slug
    );

    return { 
        props: { item } 
    };
}