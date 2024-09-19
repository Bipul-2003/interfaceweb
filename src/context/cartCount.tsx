"use client";

import getSession from "@/utils/getSession";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CartContextType {
  cartCount: number;
  updateCart: () => void;
  removeFromCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  const fetchCart = async () => {
    const response = await axios.get("/api/getCart");
    setCartCount(response.data.length);
  };

  const fetchUser = async () => {
    const session = await getSession();
    setUser(session?.user);
    console.log(session?.user || null);
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const updateCart = async () => await fetchCart();
  const removeFromCart = () =>
    setCartCount((prevCount) => Math.max(0, prevCount - 1));

  return (
    <CartContext.Provider value={{ cartCount, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
