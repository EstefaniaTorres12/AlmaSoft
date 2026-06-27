import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductosAtaud.css';
import { API_URL } from '../../config/api';

const API = `${API_URL}/api`;

const PRODUCTOS_ESTATICOS = [
  { producto_id: 's1',  producto_nombre: 'Ataúd Clásico',       producto_descripcion: 'Ataúd de madera con acabado clásico y herrajes dorados.',        producto_precio: 2500000, producto_stock: 10, producto_imagen: 'img/AtaudClasico.jpg',  categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Clásico'   },
  { producto_id: 's2',  producto_nombre: 'Ataúd Premium',        producto_descripcion: 'Ataúd premium con tapizado interior en seda y detalles finos.',   producto_precio: 4500000, producto_stock: 5,  producto_imagen: 'img/AtaudPremiun.jpg', categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Premium'   },
  { producto_id: 's3',  producto_nombre: 'Ataúd Estándar I',     producto_descripcion: 'Ataúd de madera sólida con acabado natural.',                     producto_precio: 1800000, producto_stock: 8,  producto_imagen: 'img/Ataud1.jpg',       categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Estándar'  },
  { producto_id: 's4',  producto_nombre: 'Ataúd Estándar II',    producto_descripcion: 'Ataúd con herrajes plateados y tapizado en tela.',                 producto_precio: 2200000, producto_stock: 6,  producto_imagen: 'img/Ataud2.jpg',       categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Estándar'  },
  { producto_id: 's5',  producto_nombre: 'Ataúd Laqueado',       producto_descripcion: 'Ataúd laqueado blanco con detalles elegantes.',                   producto_precio: 2000000, producto_stock: 4,  producto_imagen: 'img/Ataud3.jpg',       categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Clásico'   },
  { producto_id: 's6',  producto_nombre: 'Ataúd Nogal',          producto_descripcion: 'Ataúd de madera oscura de nogal con acabado satinado.',           producto_precio: 2800000, producto_stock: 3,  producto_imagen: 'img/Ataud4.jpg',       categoria_nombre: 'Ataúdes',          subcategoria_nombre: 'Premium'   },
  { producto_id: 's7',  producto_nombre: 'Lápida Mármol Blanco', producto_descripcion: 'Lápida de mármol blanco con grabado incluido.',                   producto_precio: 1200000, producto_stock: 7,  producto_imagen: 'img/Lapida1.jpeg',     categoria_nombre: 'Lápidas',          subcategoria_nombre: 'Mármol'    },
  { producto_id: 's8',  producto_nombre: 'Lápida Granito Negro',  producto_descripcion: 'Lápida de granito negro pulido con letras doradas.',              producto_precio: 1500000, producto_stock: 5,  producto_imagen: 'img/Lapida2.png',      categoria_nombre: 'Lápidas',          subcategoria_nombre: 'Granito'   },
  { producto_id: 's9',  producto_nombre: 'Lápida Clásica',       producto_descripcion: 'Lápida clásica en piedra gris con acabado mate.',                 producto_precio:  900000, producto_stock: 9,  producto_imagen: 'img/Lapida3.jpg',      categoria_nombre: 'Lápidas',          subcategoria_nombre: 'Clásica'   },
  { producto_id: 's10', producto_nombre: 'Lápida Premium',       producto_descripcion: 'Lápida premium con relieve decorativo y grabado láser.',          producto_precio: 2000000, producto_stock: 2,  producto_imagen: 'img/Lapida4.jpg',      categoria_nombre: 'Lápidas',          subcategoria_nombre: 'Premium'   },
  { producto_id: 's11', producto_nombre: 'Urna de Mármol',       producto_descripcion: 'Urna tallada en mármol blanco con grabado personalizado.',        producto_precio:  350000, producto_stock: 12, producto_imagen: 'img/Urna1.jpg',        categoria_nombre: 'Urnas',            subcategoria_nombre: 'Mármol'    },
  { producto_id: 's12', producto_nombre: 'Urna de Madera',       producto_descripcion: 'Urna artesanal de madera con cierre hermético y barniz.',         producto_precio:  280000, producto_stock: 10, producto_imagen: 'img/Urna2.jpg',        categoria_nombre: 'Urnas',            subcategoria_nombre: 'Madera'    },
  { producto_id: 's13', producto_nombre: 'Urna de Cerámica',     producto_descripcion: 'Urna de cerámica decorada con motivos florales sutiles.',         producto_precio:  320000, producto_stock: 8,  producto_imagen: 'img/Urna3.jpg',        categoria_nombre: 'Urnas',            subcategoria_nombre: 'Cerámica'  },
  { producto_id: 's14', producto_nombre: 'Urna Premium',         producto_descripcion: 'Urna premium de acero inoxidable con acabado pulido.',            producto_precio:  500000, producto_stock: 4,  producto_imagen: 'img/Urna4.jpg',        categoria_nombre: 'Urnas',            subcategoria_nombre: 'Premium'   },
  { producto_id: 's15', producto_nombre: 'Arreglo Clásico',      producto_descripcion: 'Arreglo floral clásico con flores blancas y verdes.',             producto_precio:  180000, producto_stock: 15, producto_imagen: 'img/Arreglo1.jpg',     categoria_nombre: 'Arreglos Florales', subcategoria_nombre: 'Clásico'  },
  { producto_id: 's16', producto_nombre: 'Arreglo Elegante',     producto_descripcion: 'Arreglo elegante con rosas y liliums en tonos suaves.',           producto_precio:  220000, producto_stock: 12, producto_imagen: 'img/Arreglo2.jpg',     categoria_nombre: 'Arreglos Florales', subcategoria_nombre: 'Elegante' },
  { producto_id: 's17', producto_nombre: 'Arreglo Blanco',       producto_descripcion: 'Arreglo en tonos blancos, símbolo de paz y pureza.',              producto_precio:  200000, producto_stock: 10, producto_imagen: 'img/Arreglo3.jpg',     categoria_nombre: 'Arreglos Florales', subcategoria_nombre: 'Clásico'  },
  { producto_id: 's18', producto_nombre: 'Corona Fúnebre',       producto_descripcion: 'Corona fúnebre de flores naturales con cinta personalizada.',     producto_precio:  350000, producto_stock: 7,  producto_imagen: 'img/Arreglo4.jpg',     categoria_nombre: 'Arreglos Florales', subcategoria_nombre: 'Especial' },
  { producto_id: 's19', producto_nombre: 'Arreglo Especial',     producto_descripcion: 'Arreglo especial con flores importadas y follaje decorativo.',    producto_precio:  280000, producto_stock: 6,  producto_imagen: 'img/Arreglo5.jpg',     categoria_nombre: 'Arreglos Florales', subcategoria_nombre: 'Especial' },
];

const precioCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(Number(v) || 0);

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

/* ── Tarjeta de producto ───────────────────────────────────── */
const ProductCard = ({ producto, onAdd, added }) => {
  const { producto_nombre, producto_descripcion, producto_precio,
          producto_stock, producto_imagen, categoria_nombre, subcategoria_nombre } = producto;

  const stock    = Number(producto_stock) || 0;
  const imgSrc   = producto_imagen ? `/${producto_imagen}` : '/img/default.png';
  const agotado  = stock === 0;
  const ultimos  = !agotado && stock <= 5;

  return (
    <article className={`pa-card${agotado ? ' pa-card--out' : ''}`}>
      <div className="pa-card__img-wrap">
        <img
          src={imgSrc}
          alt={producto_nombre}
          className="pa-card__img"
          loading="lazy"
          onError={(e) => { e.target.src = '/img/default.png'; }}
        />
        <div className="pa-card__badges">
          {agotado && <span className="pa-badge pa-badge--out">Agotado</span>}
          {ultimos  && <span className="pa-badge pa-badge--low">Últimas {stock}</span>}
          {!agotado && !ultimos && <span className="pa-badge pa-badge--ok">Disponible</span>}
        </div>
      </div>

      <div className="pa-card__body">
        <div className="pa-card__cats">
          {categoria_nombre   && <span className="pa-card__cat">{categoria_nombre}</span>}
          {subcategoria_nombre && <span className="pa-card__subcat">{subcategoria_nombre}</span>}
        </div>
        <h3 className="pa-card__name">{producto_nombre}</h3>
        <p className="pa-card__desc">{producto_descripcion}</p>

        <div className="pa-card__footer">
          <span className="pa-card__price">{precioCOP(producto_precio)}</span>
          <button
            className={`pa-card__btn${agotado ? ' pa-card__btn--disabled' : added ? ' pa-card__btn--added' : ''}`}
            onClick={() => !agotado && onAdd(producto)}
            disabled={agotado}
          >
            {agotado ? 'Sin stock' : added ? '✓ Agregado' : '+ Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
};

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
        setProductos(prods.length > 0 ? prods : PRODUCTOS_ESTATICOS);
        setCats(cRes.data    || []);
        setSubcats(sRes.data || []);
      })
      .catch(() => {
        setProductos(PRODUCTOS_ESTATICOS);
      })
      .finally(() => setCargando(false));
  }, []);

  /* Filtrado en frontend */
  const productosFiltrados = useMemo(() => {
    let list = [...productos];
    if (q)         list = list.filter(p => p.producto_nombre?.toLowerCase().includes(q.toLowerCase()) || p.producto_descripcion?.toLowerCase().includes(q.toLowerCase()));
    if (catFiltro) list = list.filter(p => p.categoria_nombre?.toLowerCase() === catFiltro.toLowerCase());
    if (subFiltro) list = list.filter(p => p.subcategoria_nombre?.toLowerCase() === subFiltro.toLowerCase());
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
          <div className="pa-grid">
            {productosFiltrados.map(p => (
              <ProductCard
                key={p.producto_id}
                producto={p}
                onAdd={handleAdd}
                added={addedIds.has(p.producto_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosAtaud;
