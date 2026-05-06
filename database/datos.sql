INSERT INTO PLAN_FUNEBRE (plan_nombre, plan_precio, plan_estado, plan_descripcion) VALUES
('Básico', 30000, 1, 'Servicios esenciales'),
('Estándar', 60000, 1, 'Incluye servicios adicionales'),
('Premium', 100000, 1, 'Servicios completos'),
('VIP', 150000, 1, 'Servicio completo + extras exclusivos');
INSERT INTO SERVICIO (servicio_nombre, servicio_descripcion, servicio_precio) VALUES
('Velación', 'Sala de velación', 0),
('Traslado', 'Transporte del cuerpo', 0),
('Preparación', 'Arreglo del cuerpo', 0),
('Ceremonia religiosa', 'Misa o ceremonia', 0),
('Acompañamiento', 'Asesor familiar', 0),
('Carroza', 'Vehículo fúnebre', 0),
('Trámites legales', 'Gestión de documentos', 0),
('Cremación', 'Servicio de cremación', 0);
-- Plan 1 (Básico)
INSERT INTO SERVICIO_PLAN VALUES (1,1),(2,1),(3,1);

-- Plan 2 (Estándar)
INSERT INTO SERVICIO_PLAN VALUES (1,2),(2,2),(3,2),(4,2),(5,2);

-- Plan 3 (Premium)
INSERT INTO SERVICIO_PLAN VALUES (1,3),(2,3),(3,3),(4,3),(5,3),(6,3),(7,3);

-- Plan 4 (VIP)
INSERT INTO SERVICIO_PLAN VALUES (1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4);
INSERT INTO CATEGORIA (categoria_nombre) VALUES
('Ataud'),
('Urna'),
('Arreglo Floral'),
('Lapida');
INSERT INTO SUBCATEGORIA (subcategoria_nombre, categoria_id) VALUES
('Tamaño-Grande',1),
('Tamaño-Mediano',1),
('Tamaño-Pequeño',1),

('Tamaño-Grande',2),
('Tamaño-Mediano',2),
('Tamaño-Pequeño',2),

('Tamaño-Grande',3),
('Tamaño-Mediano',3),
('Tamaño-Pequeño',3),

('Tamaño-Grande',4),
('Tamaño-Mediano',4),
('Tamaño-Pequeño',4);


INSERT INTO PRODUCTO 
(producto_nombre, producto_descripcion, producto_precio, producto_stock, producto_estado, subcategoria_id)
VALUES

('Ataud #1','Ataud hecho en roble',1000,10,1,1),
('Ataud #2','Ataud hecho en pino',2000,4,1,2),
('Ataud #3','Ataud hecho en abedul',3000,5,1,3),

('Urna #1','Urna de plata',4500,6,1,4),
('Urna #2','Urna de oro',2500,6,1,5),
('Urna #3','Urna floral morado',1500,2,1,6),

('Arreglo Floral #1','20 rosas rojas',6000,3,1,7),
('Arreglo Floral #2','10 rosas rojas',9000,11,1,8),
('Arreglo Floral #3','5 rosas rojas',3000,65,1,9),

('Lapida #1','lapida hecha en marmol',4000,7,1,10),
('Lapida #2','lapida hecha en granito',7000,13,1,11),
('Lapida #3','lapida hecha en loza',8000,21,0,12);
USE BBDD_FUNERARIA_ALMASOFT;
INSERT INTO ROL (rol_nombre) VALUES ('Cliente');      -- rol_id = 1
INSERT INTO ROL (rol_nombre) VALUES ('Asesor');       -- rol_id = 2
INSERT INTO ROL (rol_nombre) VALUES ('Administrador'); -- rol_id = 3
ALTER TABLE PRODUCTO 
ADD producto_imagen VARCHAR(255)



UPDATE servicio SET servicio_precio = 50000 WHERE servicio_id = 1; -- Velación
UPDATE servicio SET servicio_precio = 80000 WHERE servicio_id = 2; -- Traslado
UPDATE servicio SET servicio_precio = 120000 WHERE servicio_id = 3; -- Preparación
UPDATE servicio SET servicio_precio = 70000 WHERE servicio_id = 4; -- Ceremonia religiosa
UPDATE servicio SET servicio_precio = 40000 WHERE servicio_id = 5; -- Acompañamiento
UPDATE servicio SET servicio_precio = 150000 WHERE servicio_id = 6; -- Carroza
UPDATE servicio SET servicio_precio = 60000 WHERE servicio_id = 7; -- Trámites legales
UPDATE servicio SET servicio_precio = 300000 WHERE servicio_id = 8; -- Cremación