USE BBDD_FUNERARIA_ALMASOFT;

DELETE FROM PAGO;
DELETE FROM CONTRATO_PLAN;
DELETE FROM SERVICIO_PLAN;
DELETE FROM CONTRATO_PRODUCTO;
DELETE FROM AFILIADO;
DELETE FROM CARRITO;
DELETE FROM CONTRATO;
DELETE FROM CLIENTE;
DELETE FROM TELEFONO;
DELETE FROM ROL_USUARIO;
DELETE FROM PRODUCTO;
DELETE FROM SUBCATEGORIA;
DELETE FROM CATEGORIA;
DELETE FROM SERVICIO;
DELETE FROM PLAN_FUNEBRE;
DELETE FROM USUARIO;
DELETE FROM ROL;

ALTER TABLE ROL AUTO_INCREMENT = 1;
ALTER TABLE USUARIO AUTO_INCREMENT = 1;
ALTER TABLE CATEGORIA AUTO_INCREMENT = 1;
ALTER TABLE SUBCATEGORIA AUTO_INCREMENT = 1;
ALTER TABLE PRODUCTO AUTO_INCREMENT = 1;
ALTER TABLE SERVICIO AUTO_INCREMENT = 1;
ALTER TABLE PLAN_FUNEBRE AUTO_INCREMENT = 1;
ALTER TABLE CONTRATO AUTO_INCREMENT = 1;
ALTER TABLE PAGO AUTO_INCREMENT = 1;
ALTER TABLE ROL_USUARIO AUTO_INCREMENT = 1;
ALTER TABLE CARRITO AUTO_INCREMENT = 1;

INSERT INTO ROL (rol_nombre) VALUES
('Administrador'),
('Asesor'),
('Cliente'),
('Afiliado');


INSERT INTO USUARIO (
  usuario_primer_nombre,
  usuario_segundo_nombre,
  usuario_primer_apellido,
  usuario_segundo_apellido,
  usuario_documento,
  usuario_correo,
  usuario_direccion,
  usuario_credencial
) VALUES
('Laura', '', 'Admin', 'Sistema', 100000001, 'admin@almasoft.com', 'Cra 1 # 1-01', 'admin123'),
('Carlos', '', 'Cliente', 'Libre', 100000002, 'cliente@almasoft.com', 'Cra 2 # 2-02', 'cliente123'),
('Marta', '', 'Cliente', 'Conplan', 100000003, 'clienteplan@almasoft.com', 'Cra 3 # 3-03', 'cliente456'),
('Pedro', '', 'Asesor', 'Comercial', 100000004, 'asesor@almasoft.com', 'Cra 4 # 4-04', 'asesor123');

INSERT INTO ROL_USUARIO (rol_id, usuario_id, estado_cred) VALUES
(1, 1, true),
(3, 2, true),
(3, 3, true),
(2, 4, true);

INSERT INTO TELEFONO (telefono, usuario_id) VALUES
(3001111111, 1),
(3002222222, 2),
(3003333333, 3),
(3004444444, 4);

INSERT INTO CLIENTE (cliente_id, cliente_fecha_nacimiento, cliente_edad) VALUES
(2, '1998-05-12', 27),
(3, '1995-11-08', 30);

INSERT INTO CATEGORIA (categoria_nombre) VALUES
('Ataud'),
('Urna'),
('Arreglo Floral'),
('Lapida');

INSERT INTO SUBCATEGORIA (subcategoria_nombre, categoria_id) VALUES
('Clasica', 1),
('Premium', 1),
('Clasica', 2),
('Premium', 2),
('Natural', 3),
('Especial', 4);

INSERT INTO PRODUCTO (
  producto_nombre,
  producto_descripcion,
  producto_precio,
  producto_stock,
  producto_estado,
  subcategoria_id
) VALUES
('Ataud basico', 'Ataud de linea basica', 1200000, 10, true, 1),
('Ataud premium', 'Ataud de linea premium', 2800000, 5, true, 2),
('Urna clasica', 'Urna para ceremonia clasica', 250000, 15, true, 3),
('Urna premium', 'Urna con acabado premium', 450000, 8, true, 4),
('Arreglo natural', 'Arreglo floral natural', 180000, 20, true, 5),
('Lapida especial', 'Lapida en marmol especial', 950000, 6, true, 6);

INSERT INTO SERVICIO (servicio_nombre, servicio_descripcion, servicio_precio) VALUES
('Velacion', 'Servicio de velacion', 0),
('Traslado', 'Traslado dentro del area urbana', 0),
('Preparacion', 'Preparacion del servicio', 0),
('Acompanamiento', 'Acompanamiento ceremonial', 0);

INSERT INTO PLAN_FUNEBRE (plan_nombre, plan_precio, plan_estado, plan_descripcion) VALUES
('Basico', 30000, true, 'Plan esencial con servicios base'),
('Estandar', 50000, true, 'Plan intermedio con cobertura ampliada'),
('Premium', 80000, true, 'Plan premium con acompanamiento extendido');

INSERT INTO SERVICIO_PLAN (servicio_id, plan_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(1, 3),
(2, 3),
(3, 3),
(4, 3);

/*
Cliente 3 queda con plan activo para validar la restriccion.
Cliente 2 queda libre para probar la compra completa desde el panel.
*/
INSERT INTO CONTRATO (contrato_estado, contrato_valor, cliente_id) VALUES
(true, 50000, 3);

INSERT INTO CONTRATO_PLAN (contrato_id, plan_id) VALUES
(1, 2);

INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id) VALUES
('Tarjeta Credito | Banco: Bancolombia | Franquicia: Visa | Titular: Marta Cliente Conplan | ****1234 | Ref: TDC-DEMO-0001', CURDATE(), 1);
