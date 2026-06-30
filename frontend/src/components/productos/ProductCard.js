import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { getProductImageUrl, DEFAULT_IMAGE } from '../../utils/imageUrl';

const precioCOP = (valor) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(Number(valor) || 0);

const ProductCard = ({ producto, onAdd, onDetails, added }) => {
  const stock = Number(producto.producto_stock) || 0;
  const agotado = stock === 0;
  const imgSrc = getProductImageUrl(producto.producto_imagen);

  return (
    <Card className="mb-4 shadow-sm h-100">
      <div style={{ minHeight: 250, overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={imgSrc}
          alt={producto.producto_nombre}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          {producto.categoria_nombre && (
            <Badge bg="secondary" className="me-1">{producto.categoria_nombre}</Badge>
          )}
          {producto.subcategoria_nombre && (
            <Badge bg="light" text="dark">{producto.subcategoria_nombre}</Badge>
          )}
        </div>
        <Card.Title>{producto.producto_nombre}</Card.Title>
        <Card.Text className="text-muted mb-4">{producto.producto_descripcion || 'Sin descripción disponible.'}</Card.Text>
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <strong>{precioCOP(producto.producto_precio)}</strong>
            <small className={`text-${agotado ? 'danger' : 'muted'}`}>
              {agotado ? 'Agotado' : `Stock ${stock}`}
            </small>
          </div>
          <div className="d-grid gap-2">
            <Button
              size="sm"
              variant={added ? 'success' : 'primary'}
              onClick={() => onAdd(producto)}
              disabled={agotado}
            >
              {agotado ? 'Sin stock' : added ? '✓ Agregado' : '+ Agregar al carrito'}
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => onDetails(producto)}>
              Más detalles
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
