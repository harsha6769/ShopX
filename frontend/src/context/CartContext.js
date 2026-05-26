import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const getCartKey = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    return `cart_${parsed._id}`;
  }
  return 'cart_guest';
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const key = getCartKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  });

  // Save cart to user specific key
  useEffect(() => {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart]);

  // Reload cart when user changes (login/logout)
  useEffect(() => {
    const handleStorage = () => {
      const key = getCartKey();
      const stored = localStorage.getItem(key);
      setCart(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('userChanged', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('userChanged', handleStorage);
    };
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev =>
      prev.map(i => i._id === productId ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);