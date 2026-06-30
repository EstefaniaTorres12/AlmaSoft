import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { API_URL } from '../../config/api';

const API = `${API_URL}/api`;

const normalizeText = (value) =>
  value?.toString().normalize('NFD').replace(/[-]|[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toLowerCase() || '';

const matchesCategory = (producto, categoryName) => {
  const productCat = normalizeText(producto.categoria_nombre);
  const targetCat = normalizeText(categoryName);
  return productCat.includes(targetCat) || targetCat.includes(productCat);
};

const CategoryProductsPage = ({ categoryName, title, subtitle }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());
  const [activoProducto, setActivoProducto] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const res = await axios.get(`${API}/productos/productosAll`);
        const data = res.data?.data || [];
        setProductos(data.filter((p) => matchesCategory(p, categoryName)));
      } catch (error) {
        console.error('Error cargando productos de categoría:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    loadProductos();
  }, [categoryName]);

  const handleAdd = (producto) => {
    addToCart(producto);
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.add(producto.producto_id);
      setTimeout(() => {
        setAddedIds((current) => {
          const updated = new Set(current);
          updated.delete(producto.producto_id);
          return updated;
        });
      }, 1800);
      return next;
    });
  };

  const handleDetails = (producto) => {
    setActivoProducto(producto);
    setShowDetail(true);
  };

  const productosVisibles = useMemo(
    () => productos,
    [productos]
  );

  return (
    <Container className="py-5">
      <div className="mb-4 text-center">
        <h1>{title}</h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : productosVisibles.length === 0 ? (
        <div className="text-center py-5">
          <h5>No hay productos disponibles en esta categoría.</h5>
          <p className="text-muted">Revisa más adelante o explora otras categorías.</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productosVisibles.map((producto) => (
            <Col key={producto.producto_id}>
              <ProductCard
                producto={producto}
                onAdd={handleAdd}
                onDetails={handleDetails}
                added={addedIds.has(producto.producto_id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <ProductDetailModal
        show={showDetail}
        producto={activoProducto}
        onHide={() => setShowDetail(false)}
      />
    </Container>
  );
};

export default CategoryProductsPage;
