"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("krisluxeco_cart");
    const savedPromo = localStorage.getItem("krisluxeco_promo");
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    
    if (savedPromo) {
      try {
        const parsed = JSON.parse(savedPromo);
        setPromoCode(parsed.code);
        setDiscountPercentage(parsed.percentage);
      } catch (e) {
        console.error("Failed to parse promo", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever cart/promo changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("krisluxeco_cart", JSON.stringify(cartItems));
      
      if (promoCode) {
        localStorage.setItem("krisluxeco_promo", JSON.stringify({ code: promoCode, percentage: discountPercentage }));
      } else {
        localStorage.removeItem("krisluxeco_promo");
      }
    }
  }, [cartItems, promoCode, discountPercentage, isLoaded]);

  const addToCart = (product, quantity, targetBudget = "") => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        // If product already in cart, just update the quantity and budget
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity,
          targetBudget
        };
        return newCart;
      } else {
        // Add new item
        return [...prev, { product, quantity, targetBudget }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode(null);
    setDiscountPercentage(0);
  };

  const applyPromo = (code, percentage) => {
    setPromoCode(code);
    setDiscountPercentage(percentage);
  };

  const removePromo = () => {
    setPromoCode(null);
    setDiscountPercentage(0);
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        promoCode,
        discountPercentage,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
        cartCount,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
