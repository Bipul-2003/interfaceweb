'use client'

import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, use, useEffect } from 'react';

interface CartContextType {
  cartCount: number;
  updateCart: (value: number) => void;
  removeFromCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    const response = await axios.get("/api/getCart");
    console.log(response.data.cartitems);
    setCartCount(response.data.cartitems.length);
    // setCartCount(response.data.cartitems);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = (value: number) => setCartCount(value);
  const removeFromCart = () => setCartCount((prevCount) => Math.max(0, prevCount - 1));

  return (
    <CartContext.Provider value={{ cartCount, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};