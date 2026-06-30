import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductosAtaud.css';
import { API_URL } from '../../config/api';
import ProductCard from './ProductCard';
// eslint-disable-next-line no-unused-vars
import ProductDetailModal from './ProductDetailModal';

const API = `${API_URL}/api`;

const normalizeText = (value) =>
  value?.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || '';

/* ── Skeleton ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="pa-card pa-card--skel">
    <div className="pa-card__img-wrap pa-skel-block" />
    <div className="pa-card__body">
      <div className="pa-skel-line pa-skel-line--sm" />
      <div className="pa-skel-line" />
      <div className="pa-skel-line pa-skel-line--md" />
      <div className="pa-skel-line pa-skel-line--sm" style={{ marginTop: 'auto' }} />
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════
   PRODUCTOS PÁGINA PRINCIPAL
   ════════════════════════════════════════════════════════════ */
const ProductosAtaud = () => {
  const [productos,  setProductos]  = useState([]);
  const [cats,       setCats]       = useState([]);
  const [subcats,    setSubcats]    = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [addedIds,   setAddedIds]   = useState(new Set());
  const [sideOpen,   setSideOpen]   = useState(false);
  const [detalleProd, setDetalleProd] = useState(null);   // eslint-disable-line no-unused-vars
  const [showDetails, setShowDetails] = useState(false);  // eslint-disable-line no-unused-vars

  const [searchParams, setSearchParams] = useSearchParams();
  const q          = searchParams.get('q')           || '';
  const catFiltro  = searchParams.get('categoria')   || '';
  const subFiltro  = searchParams.get('subcategoria') || '';

  const { addToCart } = useCart();

  /* Carga datos */
  useEffect(() => {
    setCargando(true);
    Promise.all([
      fetch(`${API}/productos/productosAll`).then(r => r.json()),
      fetch(`${API}/categorias/public`).then(r => r.json()),
      fetch(`${API}/subcategorias/subCAll`).then(r => r.json()),
    ])
      .then(([pRes, cRes, sRes]) => {
        const prods = pRes.data || [];
        setProductos(prods.filter((p) => p.producto_estado === 1));
        setCats(cRes.data    || []);
        setSubcats(sRes.data || []);
      })
      .catch(() => {
        setProductos([]);
      })
      .finally(() => setCargando(false));
  }, []);

  /* Filtrado en frontend */
  const productosFiltrados = useMemo(() => {
    let list = [...productos];
    if (q) {
      const query = normalizeText(q);
      list = list.filter((p) =>
        normalizeText(p.producto_nombre).includes(query) ||
        normalizeText(p.producto_descripcion).includes(query)
      );
    }
    if (catFiltro) {
      const category = normalizeText(catFiltro);
      list = list.filter((p) => normalizeText(p.categoria_nombre) === category);
    }
    if (subFiltro) {
      const subcategory = normalizeText(subFiltro);
      list = list.filter((p) => normalizeText(p.subcategoria_nombre) === subcategory);
    }
    return list;
  }, [productos, q, catFiltro, subFiltro]);

  /* Subcategorías de una categoría */
  const subsOf = (catId) => subcats.filter(s => s.categoria_id === catId);

  /* Añadir al carrito con feedback visual */
  const handleAdd = (producto) => {
    addToCart(producto);
    setAddedIds(prev => {
      const next = new Set(prev);
      next.add(producto.producto_id);
      setTimeout(() => setAddedIds(p => { const n = new Set(p); n.delete(producto.producto_id); return n; }), 1800);
      return next;
    });
  };

  const handleDetails = (producto) => {
    setDetalleProd(producto);
    setShowDetails(true);
  };

  /* Título de la sección */
  const titulo = subFiltro
    ? `${catFiltro} › ${subFiltro}`
    : catFiltro
    ? catFiltro
    : q
    ? `Resultados para "${q}"`
    : 'Todos los productos';

  /* Aplica filtro de cat/subcat vía URL */
  const filtrarCat = (cat) => {
    setSearchParams({ categoria: cat.categoria_nombre });
    setSideOpen(false);
  };
  const filtrarSub = (cat, sub) => {
    setSearchParams({ categoria: cat.categoria_nombre, subcategoria: sub.subcategoria_nombre });
    setSideOpen(false);
  };
  const limpiarFiltros = () => {
    setSearchParams({});
    setSideOpen(false);
  };

  return (
    <div className="pa-page">

      {/* ── Sidebar móvil overlay ─────────────────────────────── */}
      {sideOpen && (
        <div className="pa-overlay" onClick={() => setSideOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={`pa-sidebar${sideOpen ? ' pa-sidebar--open' : ''}`}>
        <div className="pa-sidebar__head">
          <h3>Filtrar por</h3>
          <button className="pa-sidebar__close" onClick={() => setSideOpen(false)} aria-label="Cerrar">✕</button>
        </div>

        {(catFiltro || subFiltro || q) && (
          <button className="pa-filter-clear" onClick={limpiarFiltros}>
            ✕ Limpiar filtros
          </button>
        )}

        <div className="pa-filter-group">
          <div className="pa-filter-group__title">Categorías</div>

          {cats.map(cat => {
            const subs       = subsOf(cat.categoria_id);
            const catActiva  = catFiltro.toLowerCase() === cat.categoria_nombre.toLowerCase();

            return (
              <div key={cat.categoria_id} className="pa-filter-cat">
                <button
                  className={`pa-filter-cat__btn${catActiva ? ' active' : ''}`}
                  onClick={() => filtrarCat(cat)}
                >
                  {cat.categoria_nombre}
                  <span className="pa-filter-cat__count">
                    {productos.filter(p => p.categoria_nombre?.toLowerCase() === cat.categoria_nombre.toLowerCase()).length}
                  </span>
                </button>

                {catActiva && subs.length > 0 && (
                  <div className="pa-filter-subs">
                    {subs.map(sub => {
                      const subActiva = subFiltro.toLowerCase() === sub.subcategoria_nombre.toLowerCase();
                      return (
                        <button
                          key={sub.subcategoria_id}
                          className={`pa-filter-sub__btn${subActiva ? ' active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); filtrarSub(cat, sub); }}
                        >
                          {sub.subcategoria_nombre}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────────────── */}
      <div className="pa-main">

        {/* Cabecera */}
        <div className="pa-main__head">
          <div className="pa-main__title-row">
            <button className="pa-side-toggle" onClick={() => setSideOpen(true)} aria-label="Filtros">
              ☰ Filtros
            </button>
            <h1 className="pa-main__title">{titulo}</h1>
            {!cargando && (
              <span className="pa-main__count">
                {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Breadcrumb filtros activos */}
          {(catFiltro || subFiltro) && (
            <div className="pa-breadcrumb">
              <Link to="/productos/ProductosAtaud" className="pa-breadcrumb__link">Todos</Link>
              {catFiltro && <span className="pa-breadcrumb__sep">›</span>}
              {catFiltro && (
                <button
                  className="pa-breadcrumb__link"
                  onClick={() => setSearchParams({ categoria: catFiltro })}
                >
                  {catFiltro}
                </button>
              )}
              {subFiltro && <span className="pa-breadcrumb__sep">›</span>}
              {subFiltro && <span className="pa-breadcrumb__current">{subFiltro}</span>}
            </div>
          )}
        </div>

        {/* Grid de productos */}
        {cargando ? (
          <div className="pa-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="pa-empty">
            <p>No se encontraron productos{q ? ` para "${q}"` : ''}.</p>
            <button className="pa-empty__btn" onClick={limpiarFiltros}>Ver todos los productos</button>
          </div>
        ) : (
          <>
            <div className="pa-grid">
              {productosFiltrados.map(p => (
                <ProductCard
                  key={p.producto_id}
                  producto={p}
                  onAdd={handleAdd}
                  onDetails={handleDetails}
                  added={addedIds.has(p.producto_id)}
                />
              ))}
            </div>

            <ProductDetailModal
              show={showDetails && Boolean(detalleProd)}
              producto={detalleProd}
              onHide={() => {
                setShowDetails(false);
                setDetalleProd(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductosAtaud;
