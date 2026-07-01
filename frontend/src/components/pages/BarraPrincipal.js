import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './BarraPrincipal.css';

const BarraPrincipal = () => {
  const [busqueda,    setBusqueda]    = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isLoggedIn,  setIsLoggedIn]  = useState(!!localStorage.getItem('token'));
  const [rol,         setRol]         = useState(localStorage.getItem('rol') || '');
  const { cartCount } = useCart();
  const navigate = useNavigate();

  /* Sincroniza estado de sesión (cambios en otra pestaña / logout) */
  useEffect(() => {
    const sync = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRol(localStorage.getItem('rol') || '');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = busqueda.trim();
    navigate(q
      ? `/productos/ProductosAtaud?q=${encodeURIComponent(q)}`
      : '/productos/ProductosAtaud'
    );
    setMenuAbierto(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRol('');
    navigate('/');
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Ruta del panel según rol */
  const panelRuta = rol === 'Administrador' || rol === 'Asesor'
    ? '/clientes/Cliente'
    : '/client';

  return (
    <header className="site-header">

      {/* ── Topbar ─────────────────────────────────────────────── */}
      <div className="hdr-topbar">
        <div className="hdr-topbar__inner">
          <div className="hdr-topbar__left">
            <span>📞 +57 300 000 0000</span>
            <span>🕐 Atención 24/7</span>
          </div>
          <div className="hdr-topbar__right">
            <span>Servicio en toda Colombia</span>
          </div>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────────── */}
      <div className="hdr-main">
        <div className="hdr-main__inner">

          {/* Logo */}
          <Link to="/" className="hdr-brand" onClick={handleLogoClick}>
            <img src="/img/icons/logoAS.png" alt="AlmaSoft" className="hdr-brand__img" />
            <div>
              <span className="hdr-brand__name">AlmaSoft</span>
              <span className="hdr-brand__sub">Servicios Funerarios</span>
            </div>
          </Link>

          {/* Buscador */}
          <form className="hdr-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hdr-search__input"
              placeholder="Busca ataúdes, urnas, lápidas, arreglos florales…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar en AlmaSoft"
            />
            <button type="submit" className="hdr-search__btn">
              🔍 Buscar
            </button>
          </form>

          {/* Acciones de cuenta */}
          <div className="hdr-auth">
            {isLoggedIn ? (
              <>
                <Link to={panelRuta} className="hdr-btn-account">
                  👤 Mi cuenta
                </Link>
                <Link to="/carrito" className="hdr-btn-cart" aria-label="Carrito">
                  🛒
                  {cartCount > 0 && (
                    <span className="hdr-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </Link>
                <button className="hdr-btn-logout" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/carrito" className="hdr-btn-cart" aria-label="Carrito">
                  🛒
                  {cartCount > 0 && (
                    <span className="hdr-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </Link>
                <Link to="/pages/IniciarSesion" className="hdr-btn-login">Iniciar Sesión</Link>
                <Link to="/pages/Registrarse"   className="hdr-btn-register">Registrarse</Link>
              </>
            )}
          </div>

          {/* Hamburguesa móvil */}
          <button
            className={`hdr-hamburger${menuAbierto ? ' active' : ''}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>

        </div>
      </div>

      {/* ── Menú móvil ──────────────────────────────────────────── */}
      <div className={`hdr-mobile${menuAbierto ? ' open' : ''}`}>
        <form className="hdr-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="hdr-search__input"
            placeholder="Buscar…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="hdr-search__btn">Buscar</button>
        </form>
        <nav className="hdr-mobile-nav" aria-label="Categorías">
          <Link to="/"                            className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Inicio</Link>
          <Link to="/productos/Ataud"             className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Ataúdes</Link>
          <Link to="/productos/Urna"              className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Urnas</Link>
          <Link to="/productos/lapida"            className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Lápidas</Link>
          <Link to="/productos/arreglos-florales" className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Arreglos Florales</Link>
          <Link to="/productos/ProductosAtaud"    className="hdr-mobile-link" onClick={() => setMenuAbierto(false)}>Todos los productos</Link>
        </nav>
        <div className="hdr-mobile-auth">
          {isLoggedIn ? (
            <>
              <Link to={panelRuta}  className="hdr-btn-login"    onClick={() => setMenuAbierto(false)}>Mi cuenta</Link>
              <Link to="/carrito"   className="hdr-btn-login"    onClick={() => setMenuAbierto(false)}>Carrito {cartCount > 0 && `(${cartCount})`}</Link>
              <button className="hdr-btn-register" onClick={() => { handleLogout(); setMenuAbierto(false); }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/pages/IniciarSesion" className="hdr-btn-login"    onClick={() => setMenuAbierto(false)}>Iniciar Sesión</Link>
              <Link to="/pages/Registrarse"   className="hdr-btn-register" onClick={() => setMenuAbierto(false)}>Registrarse</Link>
              <Link to="/carrito"             className="hdr-btn-login"    onClick={() => setMenuAbierto(false)}>🛒 Carrito {cartCount > 0 && `(${cartCount})`}</Link>
            </>
          )}
        </div>
      </div>

    </header>
  );
};

export default BarraPrincipal;
