'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  updateCart: (value: number) => void;
  removeFromCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

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