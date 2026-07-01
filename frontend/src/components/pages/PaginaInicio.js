import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Carrusel from './Carrusel';
import ContactenosFooter from './ContactenosFooter';
import './PaginaInicio.css';
import { API_URL } from '../../config/api';
import { getProductImageUrl, DEFAULT_IMAGE } from '../../utils/imageUrl';

const API = `${API_URL}/api`;

/* ── Datos estáticos que NO dependen de la DB ──────────────── */
const TRUST = [
  { icon: '🛡️', title: 'Servicio confiable',    desc: 'Más de 15 años de experiencia' },
  { icon: '🕐', title: 'Atención 24/7',          desc: 'Siempre disponibles para ti'   },
  { icon: '📦', title: 'Entrega nacional',        desc: 'Cubrimos todo el país'         },
  { icon: '💜', title: 'Acompañamiento personal', desc: 'Un equipo humano contigo'      },
];

const WHY = [
  { icon: '🏆', title: 'Experiencia comprobada',  desc: 'Más de 15 años acompañando a las familias colombianas en los momentos más difíciles.' },
  { icon: '💜', title: 'Trato humano y empático',  desc: 'Nuestro equipo te acompaña con respeto y profesionalismo durante todo el proceso.'    },
  { icon: '📋', title: 'Trámites sin estrés',      desc: 'Gestionamos todos los trámites legales y administrativos por ti.'                     },
  { icon: '💰', title: 'Precios transparentes',    desc: 'Sin sorpresas ni costos ocultos. Tarifas claras y planes a tu medida.'                 },
];

/* ── Helpers ────────────────────────────────────────────────── */
const precioCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(Number(v) || 0);

const planImg = (i) => `/img/plans/plan${(i % 3) + 1}.png`;

/* Asigna color de chip según índice */
const CHIP_COLORS = ['amber', 'violet', 'slate', 'green', 'amber', 'violet', 'slate', 'green'];

/* ── ProductCard ────────────────────────────────────────────── */
const ProductCard = ({ producto, index }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { producto_nombre, producto_descripcion, producto_precio,
          producto_stock, producto_imagen, categoria_nombre } = producto;

  const stock  = Number(producto_stock) || 0;
  const imgSrc = getProductImageUrl(producto_imagen);
  const agotado = stock === 0;

  const handleAdd = () => {
    addToCart(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="home-card">
      <div className="home-card__media">
        <img
          src={imgSrc}
          alt={producto_nombre}
          className="home-card__img"
          loading="lazy"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div className="home-card__badges">
          {index < 4 && <span className="home-badge home-badge--nuevo">Destacado</span>}
          {agotado && <span className="home-badge home-badge--agotado">Agotado</span>}
          {!agotado && stock <= 5 && <span className="home-badge home-badge--bajo">Últimas {stock}</span>}
        </div>
      </div>
      <div className="home-card__body">
        <p className="home-card__cat">{categoria_nombre}</p>
        <h3 className="home-card__name">{producto_nombre}</h3>
        <p className="home-card__desc">{producto_descripcion}</p>
        <div className="home-card__price">{precioCOP(producto_precio)}</div>
        {!agotado && stock <= 5 && (
          <small className="home-card__stock home-card__stock--low">Solo {stock} disponibles</small>
        )}
        <button
          className={`home-card__btn${agotado ? ' home-card__btn--disabled' : added ? ' home-card__btn--added' : ''}`}
          onClick={agotado ? undefined : handleAdd}
          disabled={agotado}
        >
          {agotado ? 'Sin stock' : added ? '✓ Agregado al carrito' : '+ Agregar al carrito'}
        </button>
      </div>
    </article>
  );
};

/* ── PlanCard ───────────────────────────────────────────────── */
const PlanCard = ({ plan, index }) => {
  const featured = index % 3 === 1;
  return (
    <article className={`home-plan${featured ? ' home-plan--featured' : ''}`}>
      {featured && <div className="home-plan__ribbon">Más Popular</div>}
      <div className="home-plan__top">
        <img src={planImg(index)} alt={plan.plan_nombre} className="home-plan__img" />
        <h3 className="home-plan__name">{plan.plan_nombre}</h3>
        <span className="home-plan__tag">Plan funerario</span>
      </div>
      <div className="home-plan__body">
        <div className="home-plan__price">
          <span className="home-plan__price-from">Desde</span>
          <span className="home-plan__price-val">{precioCOP(plan.plan_precio)}</span>
        </div>
        <p className="home-plan__desc">
          {plan.plan_descripcion || 'Cobertura completa para ti y tu familia.'}
        </p>
        <Link to="/pages/IniciarSesion" className="home-plan__cta">
          {featured ? 'Elegir plan popular' : 'Elegir este plan'}
        </Link>
      </div>
    </article>
  );
};

/* ── Skeletons ──────────────────────────────────────────────── */
const Skeletons = ({ count = 4 }) => (
  <div className="home-skel-grid">
    {[...Array(count)].map((_, i) => <div key={i} className="home-skel" />)}
  </div>
);

/* ════════════════════════════════════════════════════════════
   PÁGINA DE INICIO
   ════════════════════════════════════════════════════════════ */
const PaginaInicio = () => {
  const [productos,  setProductos]  = useState([]);
  const [planes,     setPlanes]     = useState([]);
  const [cats,       setCats]       = useState([]);
  const [subcats,    setSubcats]    = useState([]);
  const [cargando,   setCargando]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, plRes, cRes, sRes] = await Promise.all([
          axios.get(`${API}/productos/productosAll`),
          axios.get(`${API}/planes/public`),
          axios.get(`${API}/categorias/public`),
          axios.get(`${API}/subcategorias/subCAll`),
        ]);
        setProductos(pRes.data.data   || []);
        setPlanes(plRes.data.data     || []);
        setCats(cRes.data.data        || []);
        setSubcats(sRes.data.data     || []);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setCargando(false);
      }
    };
    load();
  }, []);

  const destacados = productos.slice(0, 8);
  const recientes  = [...productos].reverse().slice(0, 6);
  const subsOf     = (catId) => subcats.filter(s => s.categoria_id === catId);

  return (
    <main className="home">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <Carrusel />

      {/* ══ TRUST STRIP ══════════════════════════════════════ */}
      <div className="home-trust">
        <div className="home-wrap">
          <div className="home-trust__grid">
            {TRUST.map((t) => (
              <div key={t.title} className="home-trust__item">
                <div className="home-trust__icon">{t.icon}</div>
                <div className="home-trust__text">
                  <strong>{t.title}</strong>
                  <span>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CATEGORÍAS (dinámicas desde DB) ══════════════════ */}
      {cats.length > 0 && (
        <section className="home-section home-section--white">
          <div className="home-wrap">
            <div className="home-sec-head">
              <div className="home-sec-titles">
                <h2 className="home-sec-title">Nuestras <span>Categorías</span></h2>
                <p className="home-sec-subtitle">Encuentra exactamente lo que necesitas</p>
              </div>
              <Link to="/productos/ProductosAtaud" className="home-ver-todo">Ver todo →</Link>
            </div>
            <div className="home-cats__scroll">
              {cats.map((cat, i) => {
                const subs  = subsOf(cat.categoria_id);
                const color = CHIP_COLORS[i % CHIP_COLORS.length];
                return (
                  <Link
                    key={cat.categoria_id}
                    to={`/productos/ProductosAtaud?categoria=${encodeURIComponent(cat.categoria_nombre)}`}
                    className="home-cat-chip"
                  >
                    <div className={`home-cat-circle home-cat-circle--${color}`}>
                      <span style={{ fontSize: '2rem' }}>
                        {i === 0 ? '⚰️' : i === 1 ? '🏺' : i === 2 ? '🪨' : '🌸'}
                      </span>
                    </div>
                    <span className="home-cat-label">{cat.categoria_nombre}</span>
                    {subs.length > 0 && (
                      <span className="home-cat-sub-count">{subs.length} tipos</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ PRODUCTOS DESTACADOS ══════════════════════════════ */}
      <section className="home-section home-section--light">
        <div className="home-wrap">
          <div className="home-sec-head">
            <div className="home-sec-titles">
              <h2 className="home-sec-title">Productos <span>Destacados</span></h2>
              <p className="home-sec-subtitle">Selección especial para ti</p>
            </div>
            <Link to="/productos/ProductosAtaud" className="home-ver-todo">Ver todo →</Link>
          </div>
          {cargando ? (
            <Skeletons count={4} />
          ) : destacados.length > 0 ? (
            <div className="home-grid">
              {destacados.map((p, i) => (
                <ProductCard key={p.producto_id} producto={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="home-empty">No hay productos disponibles en este momento.</p>
          )}
        </div>
      </section>

      {/* ══ BANNERS PROMOCIONALES ═════════════════════════════ */}
      <section className="home-section home-section--white">
        <div className="home-wrap">
          <div className="home-banners">
            <div className="home-banner home-banner--dark">
              <img src="/img/backgrounds/Promocion.png" alt="" className="home-banner__bg" />
              <div className="home-banner__overlay" />
              <div className="home-banner__body">
                <span className="home-banner__kicker">Planes funerarios</span>
                <p className="home-banner__title">
                  Acompañamiento completo en los momentos más importantes
                </p>
                <Link to="/pages/IniciarSesion" className="home-banner__btn">Ver planes</Link>
              </div>
            </div>
            <div className="home-banner home-banner--light">
              <img src="/img/carousel/2.png" alt="" className="home-banner__bg" />
              <div className="home-banner__overlay" />
              <div className="home-banner__body">
                <span className="home-banner__kicker">Catálogo completo</span>
                <p className="home-banner__title">
                  Ataúdes, urnas y arreglos florales de alta calidad
                </p>
                <Link to="/productos/ProductosAtaud" className="home-banner__btn">Ver catálogo</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TAMBIÉN TE PUEDE INTERESAR (scroll horizontal) ═══ */}
      {recientes.length > 0 && (
        <section className="home-section home-section--light">
          <div className="home-wrap">
            <div className="home-sec-head">
              <div className="home-sec-titles">
                <h2 className="home-sec-title">También te puede <span>interesar</span></h2>
                <p className="home-sec-subtitle">Más de nuestro catálogo</p>
              </div>
              <Link to="/productos/ProductosAtaud" className="home-ver-todo">Ver todo →</Link>
            </div>
            {cargando ? (
              <Skeletons count={4} />
            ) : (
              <div className="home-hscroll">
                <div className="home-hscroll__row">
                  {recientes.map((p, i) => (
                    <ProductCard key={`r-${p.producto_id}`} producto={p} index={i + 10} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ PLANES FUNERARIOS ════════════════════════════════ */}
      {(cargando || planes.length > 0) && (
        <section className="home-section home-section--white">
          <div className="home-wrap">
            <div className="home-sec-head">
              <div className="home-sec-titles">
                <h2 className="home-sec-title">Planes <span>Funerarios</span></h2>
                <p className="home-sec-subtitle">Elige el plan que mejor se adapta a tu familia</p>
              </div>
              <Link to="/pages/IniciarSesion" className="home-ver-todo">Contratar →</Link>
            </div>
            {cargando ? (
              <Skeletons count={3} />
            ) : (
              <div className="home-plans-grid">
                {planes.map((plan, i) => (
                  <PlanCard key={plan.plan_id} plan={plan} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ ¿POR QUÉ ELEGIRNOS? ══════════════════════════════ */}
      <section className="home-section home-section--light">
        <div className="home-wrap">
          <div className="home-sec-head">
            <div className="home-sec-titles">
              <h2 className="home-sec-title">¿Por qué <span>elegirnos?</span></h2>
              <p className="home-sec-subtitle">Más de 15 años cuidando a las familias colombianas</p>
            </div>
          </div>
          <div className="home-why-grid">
            {WHY.map((w) => (
              <div key={w.title} className="home-why-card">
                <div className="home-why-card__icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <ContactenosFooter />

    </main>
  );
};

export default PaginaInicio;
