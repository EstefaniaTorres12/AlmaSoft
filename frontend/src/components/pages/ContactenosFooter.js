import React from "react";
import { Link } from "react-router-dom";
import './ContactenosFooter.css';

const ContactenosFooter = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">

        {/* Brand */}
        <div className="footer__brand">
          <img src="/img/logoAS.png" alt="AlmaSoft" width="48" height="48" />
          <h3 className="footer__brand-name">ALMASOFT</h3>
          <p className="footer__brand-desc">
            Brindamos servicios funerarios con dignidad, respeto y acompañamiento
            en los momentos más difíciles de la vida.
          </p>
        </div>

        {/* Productos */}
        <div>
          <h4 className="footer__col-title">Productos</h4>
          <ul className="footer__links">
            <li><Link to="/productos/Ataud">Ataúdes</Link></li>
            <li><Link to="/productos/Urna">Urnas</Link></li>
            <li><Link to="/productos/lapida">Lápidas</Link></li>
            <li><Link to="/productos/arreglos-florales">Arreglos Florales</Link></li>
            <li><Link to="/productos/ProductosAtaud">Ver Todo</Link></li>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="footer__col-title">Empresa</h4>
          <ul className="footer__links">
            <li><Link to="/pages/AcercaDeNosotros">Acerca de Nosotros</Link></li>
            <li><Link to="/pages/IniciarSesion">Iniciar Sesión</Link></li>
            <li><Link to="/pages/Registrarse">Registrarse</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="footer__col-title">Contáctenos</h4>
          <ul className="footer__contact">
            <li>
              <span className="footer__contact-icon">Teléfono</span>
              <span className="footer__contact-val">+57 300 000 0000</span>
            </li>
            <li>
              <span className="footer__contact-icon">WhatsApp</span>
              <span className="footer__contact-val">+57 300 000 0000</span>
            </li>
            <li>
              <span className="footer__contact-icon">Correo</span>
              <span className="footer__contact-val">contacto@almasoft.com</span>
            </li>
            <li>
              <span className="footer__contact-icon">Dirección</span>
              <span className="footer__contact-val">Colombia</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} AlmaSoft. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default ContactenosFooter;
