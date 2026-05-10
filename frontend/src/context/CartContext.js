import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_KEY = 'almasoft_cart';

const loadCart = () => {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (producto) => {
    setItems(prev => {
      const existing = prev.find(i => i.producto_id === producto.producto_id);
      if (existing) {
        const maxQty = existing.stock;
        if (existing.cantidad >= maxQty) return prev;
        return prev.map(i =>
          i.producto_id === producto.producto_id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, {
        producto_id:   producto.producto_id,
        nombre:        producto.producto_nombre,
        precio:        Number(producto.producto_precio) || 0,
        imagen:        producto.producto_imagen || '',
        categoria:     producto.categoria_nombre || '',
        subcategoria:  producto.subcategoria_nombre || '',
        cantidad:      1,
        stock:         Number(producto.producto_stock) || 99,
      }];
    });
  };

  const removeFromCart = (producto_id) => {
    setItems(prev => prev.filter(i => i.producto_id !== producto_id));
  };

  const updateQuantity = (producto_id, qty) => {
    if (qty < 1) { removeFromCart(producto_id); return; }
    setItems(prev => prev.map(i =>
      i.producto_id === producto_id
        ? { ...i, cantidad: Math.min(qty, i.stock) }
        : i
    ));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.cantidad, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
