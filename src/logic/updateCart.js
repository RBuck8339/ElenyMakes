import React, {useState} from 'react';

export function updateCart(item_id, is_add) {
    if (typeof window === 'undefined') return;  // For safety

    // Get the current cart
    const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]");
    
    let updatedCart;

    if (is_add) {
        // If adding, check for duplicates first
        updatedCart = currentCart.includes(item_id) ? currentCart : [...currentCart, item_id];
    } else {
        // If removing, filter it out
        updatedCart = currentCart.filter(id => id !== item_id);
    }

    // Save to local storage
    localStorage.setItem('cart_ids', JSON.stringify(updatedCart));

    // Send update Event
    window.dispatchEvent(new Event('updateCart'));
}