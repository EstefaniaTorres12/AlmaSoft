import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Carrusel.css';

const SLIDES = [
  {
    img:     '/img/1.png',
    kicker:  'Planes funerarios',
    titulo:  'Acompañamiento en los momentos más difíciles',
    texto:   'Planes completos con dignidad, respeto y el calor humano que mereces.',
    cta:     'Ver Planes',
    ctaLink: '/pages/IniciarSesion',
  },
  {
    img:     '/img/2.png',
    kicker:  'Catálogo de productos',
    titulo:  'Productos de la más alta calidad',
    texto:   'Ataúdes, urnas, lápidas y arreglos florales para cada necesidad y presupuesto.',
    cta:     'Explorar Productos',
    ctaLink: '/productos/ProductosAtaud',
  },
  {
    img:     '/img/3.png',
    kicker:  'Siempre disponibles',
    titulo:  'Estamos cuando más nos necesitas',
    texto:   'Atención personalizada 24/7. Un equipo humano listo para acompañarte.',
    cta:     'Contáctenos',
    ctaLink: '/#footer',
  },
];

const Carrusel = () => {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const goTo = useCallback((idx) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <div
      className="hero-car"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hero-car__slide${i === current ? ' hero-car__slide--active' : ''}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.img}
            alt={slide.titulo}
            className="hero-car__img"
          />
          <div className="hero-car__overlay" />
          <div className="hero-car__caption">
            <span className="hero-car__kicker">{slide.kicker}</span>
            <h1 className="hero-car__title">{slide.titulo}</h1>
            <p className="hero-car__text">{slide.texto}</p>
            <Link to={slide.ctaLink} className="hero-car__cta">{slide.cta}</Link>
          </div>
        </div>
      ))}

      <button className="hero-car__arrow hero-car__arrow--prev" onClick={prev} aria-label="Anterior">&#8249;</button>
      <button className="hero-car__arrow hero-car__arrow--next" onClick={next} aria-label="Siguiente">&#8250;</button>

      <div className="hero-car__dots" role="tablist">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            className={`hero-car__dot${i === current ? ' hero-car__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
