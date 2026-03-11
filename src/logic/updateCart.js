import React, {useState} from 'react';

export function updateCart(item_id, is_add) {
    if (typeof window === 'undefined') return;

    // 1. Force ID to a Number to match D1/JSON IDs
    const targetId = Number(item_id);
    
    const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]")
                            .map(Number); // Ensure existing IDs are also Numbers
    
    let updatedCart;

    if (is_add) {
        // Use targetId (the Number)
        updatedCart = currentCart.includes(targetId) ? currentCart : [...currentCart, targetId];
    } else {
        updatedCart = currentCart.filter(id => id !== targetId);
    }

    localStorage.setItem('cart_ids', JSON.stringify(updatedCart));

    // 2. Trigger the refresh for Cart and Checkout pages
    window.dispatchEvent(new Event('updateCart'));
}