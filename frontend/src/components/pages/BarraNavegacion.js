import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuCategorias from './MenuCategorias';
import './BarraNavegacion.css';

const LINKS = [
  { label: 'Inicio',            to: '/',                          exact: true },
  { label: 'Ataúdes',           to: '/productos/Ataud'                        },
  { label: 'Urnas',             to: '/productos/Urna'                         },
  { label: 'Lápidas',           to: '/productos/lapida'                       },
  { label: 'Arreglos Florales', to: '/productos/arreglos-florales'            },
  { label: 'Todos los productos', to: '/productos/ProductosAtaud'             },
  { label: 'Acerca de Nosotros', to: '/pages/AcercaDeNosotros'               },
];

const BarraNavegacion = () => {
  const location = useLocation();

  const isActive = (link) =>
    link.exact
      ? location.pathname === link.to
      : location.pathname.startsWith(link.to);

  return (
    <nav className="cat-nav" aria-label="Navegación de categorías">
      <div className="cat-nav__inner">

        {/* Menú hamburguesa con categorías dinámicas */}
        <MenuCategorias />

        <span className="cat-nav__sep" />

        {/* Links directos */}
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={[
              'cat-nav__link',
              isActive(link) ? 'cat-nav__link--active' : '',
            ].filter(Boolean).join(' ')}
          >
            {link.label}
          </Link>
        ))}

      </div>
    </nav>
  );
};

export default BarraNavegacion;
