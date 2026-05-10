import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Carrito.css';

const precioCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(Number(v) || 0);

const METODOS = ['Efectivo', 'Tarjeta débito', 'Tarjeta crédito', 'PSE'];

const Carrito = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [fase,       setFase]       = useState('carrito'); // 'carrito' | 'checkout' | 'confirmado'
  const [metodo,     setMetodo]     = useState('Efectivo');
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const rol        = localStorage.getItem('rol') || '';

  /* Para clientes autenticados: usa la API del backend */
  const confirmarPedido = async () => {
    setProcesando(true);

    /* Si es cliente autenticado, intenta usar la API real */
    if (isLoggedIn && rol === 'Cliente') {
      try {
        const { authFetch } = await import('../../utils/authFetch');
        /* Agrega items al carrito del backend y luego hace checkout */
        for (const item of items) {
          await authFetch('http://localhost:3001/api/client/store/carrito', {
            method: 'POST',
            body: JSON.stringify({ producto_id: item.producto_id, cantidad: item.cantidad }),
          });
        }
        const res  = await authFetch('http://localhost:3001/api/client/store/carrito/checkout', {
          method: 'POST',
          body: JSON.stringify({ metodo_pago: metodo }),
        });
        const data = await res.json();
        if (data.success) {
          clearCart();
          setFase('confirmado');
          setProcesando(false);
          return;
        }
      } catch (_) { /* fallback a confirmación visual */ }
    }

    /* Para invitados o si falla: confirmación visual */
    setTimeout(() => {
      clearCart();
      setFase('confirmado');
      setProcesando(false);
    }, 1200);
  };

  /* ── Vista confirmación ─────────────────────────────────── */
  if (fase === 'confirmado') {
    return (
      <div className="cart-page">
        <div className="cart-confirm">
          <div className="cart-confirm__icon">✓</div>
          <h2>¡Pedido confirmado!</h2>
          <p>Gracias por tu compra. Nos pondremos en contacto contigo pronto.</p>
          <div className="cart-confirm__actions">
            <button className="cart-confirm__btn" onClick={() => navigate('/')}>
              Ir al inicio
            </button>
            <button className="cart-confirm__btn cart-confirm__btn--outline" onClick={() => navigate('/productos/ProductosAtaud')}>
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-wrap">

        {/* ── Cabecera ──────────────────────────────────────── */}
        <div className="cart-header">
          <h1 className="cart-header__title">
            🛒 {fase === 'checkout' ? 'Confirmar pedido' : 'Carrito de compras'}
          </h1>
          {fase === 'carrito' && items.length > 0 && (
            <button className="cart-clear" onClick={clearCart}>Vaciar carrito</button>
          )}
          {fase === 'checkout' && (
            <button className="cart-back" onClick={() => setFase('carrito')}>← Volver al carrito</button>
          )}
        </div>

        {/* ── Carrito vacío ─────────────────────────────────── */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos desde el catálogo para comenzar tu compra.</p>
            <Link to="/productos/ProductosAtaud" className="cart-empty__btn">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── Lista de items ─────────────────────────────── */}
            <div className="cart-items">
              {fase === 'carrito' ? (
                items.map(item => (
                  <div key={item.producto_id} className="cart-item">
                    <div className="cart-item__img">
                      <img
                        src={item.imagen ? `/${item.imagen}` : '/img/default.png'}
                        alt={item.nombre}
                        onError={(e) => { e.target.src = '/img/default.png'; }}
                      />
                    </div>
                    <div className="cart-item__info">
                      {item.categoria && <span className="cart-item__cat">{item.categoria}</span>}
                      <h3 className="cart-item__name">{item.nombre}</h3>
                      <span className="cart-item__price">{precioCOP(item.precio)}</span>
                    </div>
                    <div className="cart-item__qty">
                      <button
                        className="cart-qty__btn"
                        onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                      >–</button>
                      <span className="cart-qty__val">{item.cantidad}</span>
                      <button
                        className="cart-qty__btn"
                        onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock}
                      >+</button>
                    </div>
                    <div className="cart-item__subtotal">
                      {precioCOP(item.precio * item.cantidad)}
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.producto_id)}
                      aria-label="Eliminar"
                    >✕</button>
                  </div>
                ))
              ) : (
                /* Vista resumen checkout */
                <div className="cart-summary-list">
                  <h3 className="cart-summary-list__title">Resumen del pedido</h3>
                  {items.map(item => (
                    <div key={item.producto_id} className="cart-summary-row">
                      <span className="cart-summary-row__name">{item.nombre} × {item.cantidad}</span>
                      <span className="cart-summary-row__price">{precioCOP(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Método de pago (en checkout) */}
              {fase === 'checkout' && (
                <div className="cart-metodo">
                  <label className="cart-metodo__label">Método de pago</label>
                  <div className="cart-metodo__options">
                    {METODOS.map(m => (
                      <button
                        key={m}
                        className={`cart-metodo__opt${metodo === m ? ' active' : ''}`}
                        onClick={() => setMetodo(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Aviso para invitados */}
              {!isLoggedIn && fase === 'checkout' && (
                <div className="cart-guest-notice">
                  💡 Tu pedido se registrará como solicitud. Para un seguimiento completo,{' '}
                  <Link to="/pages/IniciarSesion">inicia sesión</Link> antes de confirmar.
                </div>
              )}
            </div>

            {/* ── Panel lateral totales ─────────────────────── */}
            <div className="cart-sidebar">
              <div className="cart-totals">
                <div className="cart-totals__row">
                  <span>Subtotal ({items.reduce((s, i) => s + i.cantidad, 0)} artículos)</span>
                  <span>{precioCOP(cartTotal)}</span>
                </div>
                <div className="cart-totals__row cart-totals__row--total">
                  <span>Total</span>
                  <strong>{precioCOP(cartTotal)}</strong>
                </div>

                {fase === 'carrito' ? (
                  <button
                    className="cart-totals__cta"
                    onClick={() => setFase('checkout')}
                  >
                    Proceder al pago →
                  </button>
                ) : (
                  <button
                    className="cart-totals__cta"
                    onClick={confirmarPedido}
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando…' : '✓ Confirmar pedido'}
                  </button>
                )}

                <Link to="/productos/ProductosAtaud" className="cart-totals__secondary">
                  ← Seguir comprando
                </Link>
              </div>

              <div className="cart-trust">
                <div className="cart-trust__item">🛡️ Compra segura</div>
                <div className="cart-trust__item">📦 Entrega en toda Colombia</div>
                <div className="cart-trust__item">🕐 Atención 24/7</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
