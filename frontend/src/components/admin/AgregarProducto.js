import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const AgregarProducto = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    estado: "1",
    imagen: "",
    categoria_id: "",
    subcategoria_id: ""
  });

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subFiltradas, setSubFiltradas] = useState([]);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  // 🔹 CARGAR CATEGORIAS
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await authFetch("http://localhost:3001/api/categorias");
        const data = await res.json();

        if (res.ok) {
          setCategorias(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategorias();
  }, []);

  // 🔹 CARGAR SUBCATEGORIAS
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await authFetch("http://localhost:3001/api/subcategorias/subCAll");
        const data = await res.json();

        if (res.ok) {
          setSubcategorias(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSub();
  }, []);

  // 🔥 FILTRAR SUBCATEGORIAS SEGÚN CATEGORIA
  useEffect(() => {
    const filtradas = subcategorias.filter(
      sc => sc.categoria_id === parseInt(formData.categoria_id)
    );
    setSubFiltradas(filtradas);
  }, [formData.categoria_id, subcategorias]);

  // 🔹 HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 ENVIAR
  const enviarDatos = async (e) => {
    e.preventDefault();

    const producto = {
      producto_nombre: formData.nombre,
      producto_descripcion: formData.descripcion,
      producto_precio: parseFloat(formData.precio),
      producto_stock: parseInt(formData.stock),
      producto_estado: parseInt(formData.estado),
      producto_imagen: formData.imagen,
      subcategoria_id: parseInt(formData.subcategoria_id)
    };

    try {
      const res = await authFetch(
        "http://localhost:3001/api/productos/createProducto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto)
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMostrarAlerta(true);

        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          estado: "1",
          imagen: "",
          categoria_id: "",
          subcategoria_id: ""
        });

        setTimeout(() => {
          navigate("/admin/ProductoFront"); // opcional
        }, 1500);

      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Header>
          <h3 className="text-center">Agregar Producto</h3>

          {mostrarAlerta && (
            <Alert
              variant="success"
              onClose={() => setMostrarAlerta(false)}
              dismissible
            >
              Producto creado correctamente
            </Alert>
          )}
        </Card.Header>

        <Card.Body>
          <Form onSubmit={enviarDatos}>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formData.nombre} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={formData.descripcion} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ruta Imagen</Form.Label>
              <Form.Control
                name="imagen"
                placeholder="/img/ataud1.jpg"
                value={formData.imagen}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="categoria_id" value={formData.categoria_id} onChange={handleChange}>
                <option value="">Seleccione</option>
                {categorias.map(c => (
                  <option key={c.categoria_id} value={c.categoria_id}>
                    {c.categoria_nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Subcategoría</Form.Label>
              <Form.Select name="subcategoria_id" value={formData.subcategoria_id} onChange={handleChange}>
                <option value="">Seleccione</option>
                {subFiltradas.map(sc => (
                  <option key={sc.subcategoria_id} value={sc.subcategoria_id}>
                    {sc.subcategoria_nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button style={{ background: "#7856AE", border: "#7856AE" }} type="submit">
              Guardar
            </Button>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AgregarProducto;