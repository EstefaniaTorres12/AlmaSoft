import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuCategorias.css';
import { API_URL } from '../../config/api';

const API = `${API_URL}/api`;

const MenuCategorias = () => {
  const [open,    setOpen]    = useState(false);
  const [cats,    setCats]    = useState([]);
  const [subcats, setSubcats] = useState([]);
  const [hovered, setHovered] = useState(null);
  const menuRef  = useRef(null);
  const navigate = useNavigate();

  /* Carga categorías y subcategorías una sola vez */
  useEffect(() => {
    Promise.all([
      fetch(`${API}/categorias/public`).then(r => r.json()),
      fetch(`${API}/subcategorias/subCAll`).then(r => r.json()),
    ])
      .then(([cData, sData]) => {
        setCats(cData.data   || []);
        setSubcats(sData.data || []);
      })
      .catch(console.error);
  }, []);

  /* Cierra al hacer click fuera o presionar Escape */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown',   handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown',   handleKey);
    };
  }, [open]);

  const subsOfCat   = (catId) => subcats.filter(s => s.categoria_id === catId);
  const activeCat   = cats.find(c => c.categoria_id === hovered);
  const activeSubs  = hovered ? subsOfCat(hovered) : [];

  const navigate_ = (cat, sub = null) => {
    const url = sub
      ? `/productos/ProductosAtaud?categoria=${encodeURIComponent(cat.categoria_nombre)}&subcategoria=${encodeURIComponent(sub.subcategoria_nombre)}`
      : `/productos/ProductosAtaud?categoria=${encodeURIComponent(cat.categoria_nombre)}`;
    navigate(url);
    setOpen(false);
    setHovered(null);
  };

  return (
    <div className="mc" ref={menuRef}>
      {/* Botón hamburguesa */}
      <button
        className={`mc__btn${open ? ' mc__btn--open' : ''}`}
        onClick={() => { setOpen(v => !v); setHovered(null); }}
        aria-label="Abrir categorías"
        aria-expanded={open}
      >
        <span className="mc__icon">
          <span /><span /><span />
        </span>
        <span className="mc__label">Categorías</span>
      </button>

      {/* Panel flotante */}
      {open && (
        <div className="mc__panel" role="menu">

          {/* Columna izquierda: categorías */}
          <div className="mc__col mc__col--cats">
            <div className="mc__col-title">Categorías</div>
            {cats.length === 0 ? (
              <p className="mc__empty">Cargando…</p>
            ) : (
              cats.map(cat => (
                <button
                  key={cat.categoria_id}
                  role="menuitem"
                  className={`mc__cat-item${hovered === cat.categoria_id ? ' mc__cat-item--active' : ''}`}
                  onMouseEnter={() => setHovered(cat.categoria_id)}
                  onClick={() => navigate_(cat)}
                >
                  <span>{cat.categoria_nombre}</span>
                  {subsOfCat(cat.categoria_id).length > 0 && (
                    <span className="mc__arrow">›</span>
                  )}
                </button>
              ))
            )}
            <div className="mc__divider" />
            <button
              className="mc__cat-item mc__cat-item--all"
              onClick={() => { navigate('/productos/ProductosAtaud'); setOpen(false); }}
            >
              Ver todos los productos →
            </button>
          </div>

          {/* Columna derecha: subcategorías */}
          {activeSubs.length > 0 && (
            <div className="mc__col mc__col--subs">
              <div className="mc__col-title">{activeCat?.categoria_nombre}</div>
              {activeSubs.map(sub => (
                <button
                  key={sub.subcategoria_id}
                  role="menuitem"
                  className="mc__sub-item"
                  onClick={() => navigate_(activeCat, sub)}
                >
                  {sub.subcategoria_nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCategorias;
