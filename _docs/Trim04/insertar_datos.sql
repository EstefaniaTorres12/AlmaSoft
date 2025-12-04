INSERT INTO ROL VALUES
(null,'Administrador'),
(null,'Asesor'),
(null,'Clieente'),
(null,'Afiliado');


INSERT INTO USUARIO VALUES
(null, 'Lina','','Avila','Osorio', 1023778923 ,'lina@gmail.com','Kra 9a #7-8',sha1('lina123')),
(null, 'Fernando','','Prieto','Diaz', 1224881021 ,'fernando@gmail.com','TV 80 #12-13c',sha1('fernando1234')),
(null, 'Janeth','','Castillo','Mendez', 39653112 ,'castillo@gmail.com','DG 16 #3-2',sha1('12345678')),
(null, 'Yina','Alexandra','Moreno','Gonzales', 43043003 ,'moreno123@hotmail.com','Cl 19 #45b40',sha1('hijklmn')),
(null, 'Juan','David','Moreno','Gonzales', 587441133 ,'juanM@outlook.com','TV 50 #60 B SUR 70',sha1('JUAN123456789')),
(null, 'Sara','Milena','Gordillo','Rojas', 1111770083 ,'sara12@gmail.com','Kra 10b #1-2',sha1('123ABC')),
(null, 'Felipe','','Gonzales','Lopez', 1021454216 ,'felipe@gmail.com','TV 69 #34-41',sha1('hola123')),
(null, 'Liliana','','Gonzales','Lopez', 1021456456 ,'liliana@gmail.com','TV 69 #34-41',sha1(789456)),
(null, 'Anderson','Giovanny','Montoya','Rojas', 1022006765 ,'anderson@gmail.com','Calle 75 # 76-98',sha1(123456)),
(null, 'Michael','','Fonseca','Mendoza', 1021456765 ,'maicol@gmail.com','TV 69 #34-14',sha1(654321));


INSERT INTO ROL_USUARIO Values
(null,3,4,true),
(null,3,5,true),
(null,4,6,true),
(null,4,7,true),
(null,4,8,true),
(null,4,9,true),
(null,4,10,true),
(null,3,3,true),
(null,2,1,false),
(null,1,2,true);

INSERT INTO TELEFONO values
(3125544889,4),
(3152369857,5),
(3524896325,6),
(3114785236,7),
(3189657412,8),
(3124587119,9),
(3125598849,10),
(3125544889,1),
(3114478976,2),
(3224877855,3);

INSERT INTO CLIENTE VALUES
(4,'1999-07-20',26),
(5,'2000-04-11',25),

(3,'2000-05-15',25);


INSERT INTO CONTRATO VALUES
(null,true,20000,4),
(null,true,15000,5),

(null,true,60000,3);


INSERT INTO AFILIADO VALUES
(7,2),
(8,2),
(9,3),
(10,3),

(4,1);

INSERT INTO CATEGORIA values
(null,'Ataud'),
(null,'Urna'),
(null,'Arreglo Floral'),
(null,'Lapida');

INSERT INTO SUBCATEGORIA VALUES
(null,'Tamaño-Grande',1),
(null,'Tamaño-Mediano',1),
(null,'Tamaño-Pequeño',1),
(null,'Tamaño-Grande',2),
(null,'Tamaño-Mediano',2),
(null,'Tamaño-Pequeño',2),
(null,'Tamaño-Grande',3),
(null,'Tamaño-Mediano',3),
(null,'Tamaño-Pequeño',3),
(null,'Tamaño-Grande',4),
(null,'Tamaño-Mediano',4),
(null,'Tamaño-Pequeño',4);

INSERT INTO PRODUCTO VALUES
(NULL,'ataud #1','Ataud hecho en roble',1000,10,true,1),
(NULL,'ataud #2','Ataud hecho en pino',2000,4,true,2),
(NULL,'ataud #3','Ataud hecho en abedul',3000,5,true,3),
(NULL,'Unrna #1','Urna de plata',4500,6,true,4),
(NULL,'Unrna #2','Urna de oro',2500,6,true,5),
(NULL,'Unrna #3','Urna de flor morado',1500,2,true,6),
(NULL,'Arreglo Floral #1','20 rosas rojas',6000,3,true,7),
(NULL,'Arreglo Floral #2','10 rosas rojas',9000,11,true,8),
(NULL,'Arreglo Floral #1','5 rosas rojas',3000,65,true,9),
(NULL,'Lapida #1','lapida hecha en marmol',4000,7,true,10),
(NULL,'Lapida #2','lapida hecha en granito',7000,13,true,11),
(NULL,'Lapida #3','lapida hecha en loza ',8000,21,false,12);

INSERT INTO CONTRATO_PRODUCTO VALUES
(1,1),
(1,4),
(1,7),
(1,12),
(2,3),
(2,6),
(2,12),
(3,2),
(3,5),
(3,11);


INSERT INTO PLAN_FUNEBRE VALUES
(NULL,'PREMIUN',65000,TRUE),
(NULL,'CLASSIC',45000,TRUE),
(NULL,'BASSIC',25000,TRUE);


INSERT INTO CONTRATO_PLAN VALUES
(3,3),
(2,1),
(1,2);

INSERT INTO SERVICIO VALUES 
(NULL,'MISA','NHGHBDHDFJ',45000),
(NULL,'VELACION','NHGHBDHDFJ',45000), 
(NULL,'EXHUMACION','NHGHBDHDFJ',45000),
(NULL,'SEPELIO','NHGHBDHDFJ',45000);

INSERT INTO SERVICIO_PLAN VALUES
(1,1),
(1,2),
(1,3),
(2,1),
(2,2),
(2,3),
(3,1),
(3,2),
(3,3),
(4,1),
(4,2),
(4,3);

INSERT INTO PAGO VALUES
(null,'TARJETA DEBITO','2025-05-01',2),
(null,'EFECTIVO','2025-05-08',3),

(NULL,'EFECTIVO','2025-12-04',1);

select * from pago;