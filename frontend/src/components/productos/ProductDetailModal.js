import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { getProductImageUrl, DEFAULT_IMAGE } from '../../utils/imageUrl';

const API = `${API_URL}/api`;

const precioCOP = (valor) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(Number(valor) || 0);

const ProductDetailModal = ({ show, producto, onHide }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !producto) return;
    let active = true;
    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API}/productos/producto/${producto.producto_id}`);
        const detail = res.data?.data || producto;
        if (active) setData(detail);
      } catch (err) {
        if (active) {
          setError('No se pudieron cargar más detalles.');
          setData(producto);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDetail();
    return () => { active = false; };
  }, [show, producto]);

  const display = data || producto;
  const imgSrc = getProductImageUrl(display?.producto_imagen);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{display?.producto_nombre || 'Detalle del producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="row gx-4 gy-3">
            <div className="col-md-5">
              <img
                src={imgSrc}
                alt={display?.producto_nombre}
                className="img-fluid rounded"
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
              />
            </div>
            <div className="col-md-7">
              <div className="mb-2">
                {display?.categoria_nombre && <Badge bg="secondary" className="me-1">{display.categoria_nombre}</Badge>}
                {display?.subcategoria_nombre && <Badge bg="light" text="dark">{display.subcategoria_nombre}</Badge>}
              </div>
              <p className="text-muted">{display?.producto_descripcion || 'Sin descripción disponible.'}</p>
              <div className="mb-3">
                <strong className="fs-4">{precioCOP(display?.producto_precio)}</strong>
              </div>
              <div className="mb-3">
                <span className={display?.producto_stock > 0 ? 'text-success' : 'text-danger'}>
                  {display?.producto_stock > 0 ? `Stock disponible: ${display.producto_stock}` : 'Sin stock'}
                </span>
              </div>
              {error && <div className="alert alert-warning py-2">{error}</div>}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
