import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

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

  const isLoggedIn = !!localStorage.getItem('token');

  const fetchBackendCart = async () => {
    if (!isLoggedIn) return;
    try {
      const { authFetch } = await import('../utils/authFetch');
      const res = await authFetch(`${API_URL}/api/client/store/carrito`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((it) => ({
          carrito_id: it.carrito_id,
          producto_id: it.producto_id,
          nombre: it.producto_nombre,
          precio: Number(it.producto_precio) || 0,
          imagen: it.producto_imagen || '',
          categoria: it.categoria_nombre || '',
          cantidad: it.cantidad,
          stock: Number(it.producto_stock) || 99,
        }));
        setItems(mapped);
      }
    } catch (e) {
      // Silencioso: mantener cache local si falla
    }
  };

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    // Al montar, si hay sesión, sincronizamos desde el backend
    fetchBackendCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const addToCart = (producto) => {
    // Si el usuario está autenticado, delegar en el backend y refrescar
    const doLocalAdd = () => {
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

    if (!isLoggedIn) {
      doLocalAdd();
      return;
    }

    (async () => {
      try {
        const { authFetch } = await import('../utils/authFetch');
        await authFetch(`${API_URL}/api/client/store/carrito`, {
          method: 'POST',
          body: JSON.stringify({ producto_id: producto.producto_id, cantidad: 1 }),
        });
        await fetchBackendCart();
      } catch (e) {
        // Fallback local
        doLocalAdd();
      }
    })();
  };

  const removeFromCart = (producto_id) => {
    const doLocalRemove = () => setItems(prev => prev.filter(i => i.producto_id !== producto_id));

    if (!isLoggedIn) { doLocalRemove(); return; }

    (async () => {
      try {
        const { authFetch } = await import('../utils/authFetch');
        // intentar localizar el carrito_id desde el estado
        const existing = items.find(i => i.producto_id === producto_id);
        if (existing && existing.carrito_id) {
          await authFetch(`${API_URL}/api/client/store/carrito/${existing.carrito_id}`, { method: 'DELETE' });
          await fetchBackendCart();
          return;
        }
        // si no existe carrito_id, refrescar desde backend
        await fetchBackendCart();
      } catch (e) {
        doLocalRemove();
      }
    })();
  };

  const updateQuantity = (producto_id, qty) => {
    if (qty < 1) { removeFromCart(producto_id); return; }

    const doLocalUpdate = () => setItems(prev => prev.map(i =>
      i.producto_id === producto_id
        ? { ...i, cantidad: Math.min(qty, i.stock) }
        : i
    ));

    if (!isLoggedIn) { doLocalUpdate(); return; }

    (async () => {
      try {
        const { authFetch } = await import('../utils/authFetch');
        // Asegurarse del estado actual en backend
        await fetchBackendCart();
        const existing = items.find(i => i.producto_id === producto_id);
        const current = existing ? existing.cantidad : 0;

        if (qty === current) return;
        if (qty > current) {
          // aumentar: usar POST con la diferencia
          const diff = qty - current;
          await authFetch(`${API_URL}/api/client/store/carrito`, {
            method: 'POST',
            body: JSON.stringify({ producto_id, cantidad: diff }),
          });
          await fetchBackendCart();
          return;
        }

        // reducir: eliminar fila y reinsertar si qty>0
        if (existing && existing.carrito_id) {
          await authFetch(`${API_URL}/api/client/store/carrito/${existing.carrito_id}`, { method: 'DELETE' });
          if (qty > 0) {
            await authFetch(`${API_URL}/api/client/store/carrito`, {
              method: 'POST',
              body: JSON.stringify({ producto_id, cantidad: qty }),
            });
          }
          await fetchBackendCart();
          return;
        }
      } catch (e) {
        doLocalUpdate();
      }
    })();
  };

  const clearCart = () => setItems([]);

  const clearCartRemote = async () => {
    if (!isLoggedIn) { clearCart(); return; }
    try {
      const { authFetch } = await import('../utils/authFetch');
      // borrar cada elemento remoto
      const res  = await authFetch(`${API_URL}/api/client/store/carrito`);
      const data = await res.json();
      if (data.success) {
        for (const it of data.data) {
          if (it.carrito_id) await authFetch(`${API_URL}/api/client/store/carrito/${it.carrito_id}`, { method: 'DELETE' });
        }
      }
    } catch (e) {
      // ignore
    }
    clearCart();
  };

  const cartCount = items.reduce((sum, i) => sum + i.cantidad, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart: clearCartRemote, cartCount, cartTotal,
      // utilitario expuesto para sincronizar manualmente
      refreshFromServer: fetchBackendCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
