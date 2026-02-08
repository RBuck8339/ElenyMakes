import React, {useState} from 'react';

export function updateCart(item_id, is_add){
    const currentCart = JSON.parse(localStorage.getItem('cart_ids')) || [];
    let updatedCart;

    if(is_add)
        updatedCart = currentCart.includes(item_id) ? currentCart : [...currentCart, item_id];
    else
        updatedCart = currentCart.filter(id => id !== item_id)

    localStorage.setItem('cart_ids', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('updateCart'));  // Show the function has been called for later updates
}