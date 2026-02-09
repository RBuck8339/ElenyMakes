import React, {useState} from 'react';

export function updateCart(item_id, is_add) {
    // 1. Safety Check: Ensure we are in the browser (fixes "localStorage is not defined" error)
    if (typeof window === 'undefined') return;

    // 2. Get the current cart directly
    // (We don't need useEffect because this function only runs when a user clicks something)
    const currentCart = JSON.parse(localStorage.getItem('cart_ids') || "[]");
    
    let updatedCart;

    // 3. Perform the logic
    if (is_add) {
        // If adding, check for duplicates first
        updatedCart = currentCart.includes(item_id) ? currentCart : [...currentCart, item_id];
    } else {
        // If removing, filter it out
        updatedCart = currentCart.filter(id => id !== item_id);
    }

    // 4. Save back to local storage
    localStorage.setItem('cart_ids', JSON.stringify(updatedCart));

    // 5. Notify the rest of the app that the cart changed
    // (This helps update your UI instantly without refreshing)
    window.dispatchEvent(new Event('updateCart'));
}