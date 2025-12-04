/* ************************************************************************************* */
/* ---------------------------------------- DDL ---------------------------------------- */
/* ----------------------------- DATA DEFINITION LANGUAGE ------------------------------ */
/* -------------------------- LENGUAJE DE DEFINICIÓN DE DATOS -------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 01. Mostrar BBDDs : .................... SHOW DATABASES                               */

SHOW DATABASES;

/* 02. Usar BBDD : ........................ USE __                                       */

USE BBDD_FUNERARIA_ALMASOFT;

/* 03. Eliminar BBDD : .................... DROP DATABASE __                             */

DROP DATABASE BBDD_FUNERARIA_ALMASOFT;

/* 04. Mostrar Tablas : ................... SHOW TABLES __.                              */

SHOW TABLES;

/* 05. Mostar Columnas : .................. SHOW COLUMNS FROM __ . DESCRIBE __           */

SHOW COLUMNS FROM USUARIO;
DESCRIBE USUARIO;

SHOW COLUMNS FROM ROL;
DESCRIBE ROL;


/* 06. Agregar Columna : .................. ALTER TABLE __ ADD __ __                     */

ALTER TABLE USUARIO ADD nueva_columna varchar(45);

/* 07. Renombrar Columna : ................ ALTER TABLE __ CHANGE __ __                  */

ALTER TABLE TELEFONO CHANGE Telefono telefono bigint;

/* 08. Eliminar Columna : ................. ALTER TABLE __ DROP __                       */

ALTER TABLE CONTRATO DROP afiliado_id;

/* 09. Agregar Valor x Defecto Columna : .. ALTER TABLE __ ALTER __ SET DEFAULT __       */

ALTER TABLE USUARIO ALTER usuario_id SET DEFAULT 2;

/* 10. Eliminar Valor x Defecto Columna : . ALTER TABLE __ ALTER __ DROP DEFAULT         */

ALTER TABLE USUARIO ALTER usuario_id DROP DEFAULT;

/* 11. Mostrar Creación Tabla : ........... SHOW CREATE TABLE __                         */

SHOW CREATE TABLE USUARIO;
SHOW CREATE TABLE ROL;
SHOW CREATE TABLE CONTRATO;

/* 12. Eliminar Restricción : ............. ALTER TABLE __ DROP CONSTRAINT __            */

ALTER TABLE ROL_USUARIO DROP CONSTRAINT fk_rol_id;
ALTER TABLE TELEFONO DROP CONSTRAINT fk_usuario_telefono;
ALTER TABLE AFILIADO DROP CONSTRAINT fk_usuario_afiliado;
ALTER TABLE CLIENTE DROP CONSTRAINT fk_usuario_cliente;
ALTER TABLE CONTRATO DROP CONSTRAINT fk_afiliado_contrato;
ALTER TABLE CONTRATO DROP CONSTRAINT fk_cliente_contrato;

/* 13. Eliminar Índice : .................. ALTER TABLE __ DROP INDEX __                 */

ALTER TABLE ROL_USUARIO DROP INDEX ind_rol_usuario;

/* 14. Eliminar Llave Primaria : .......... ALTER TABLE __ DROP PRIMARY KEY              */

ALTER TABLE ROL DROP PRIMARY KEY;
ALTER TABLE USUARIO DROP PRIMARY KEY;
ALTER TABLE CONTRATO DROP PRIMARY KEY;
ALTER TABLE PAGO DROP PRIMARY KEY;
ALTER TABLE PLAN_FUNEBRE DROP PRIMARY KEY;
ALTER TABLE PRODUCTO DROP PRIMARY KEY;

/* 15. Limpiar Registros : ................ TRUNCATE __                                  */

TRUNCATE AFILIADO;
TRUNCATE CATEGORIA;
TRUNCATE CLIENTE;
TRUNCATE CONTRATO;
TRUNCATE CONTRATO_PLAN;
TRUNCATE CONTRATO_PRODUCTO;
TRUNCATE PAGO;
TRUNCATE PLAN_FUNEBRE;
TRUNCATE PRODUCTO;
TRUNCATE ROL;
TRUNCATE ROL_USUARIO;
TRUNCATE SERVICIO;
TRUNCATE SERVICIO_PLAN;
TRUNCATE SUBCATEGORIA;
TRUNCATE TELEFONO;
TRUNCATE USUARIO;

/* 16. Eliminar Tabla : ................... DROP TABLE __                                */

DROP TABLE AFILIADO;
DROP TABLE CATEGORIA;
DROP TABLE CLIENTE;
DROP TABLE CONTRATO;
DROP TABLE CONTRATO_PLAN;
DROP TABLE CONTRATO_PRODUCTO;
DROP TABLE PAGO;
DROP TABLE PLAN_FUNEBRE;
DROP TABLE PRODUCTO;
DROP TABLE ROL;
DROP TABLE ROL_USUARIO;
DROP TABLE SERVICIO;
DROP TABLE SERVICIO_PLAN;
DROP TABLE SUBCATEGORIA;
DROP TABLE TELEFONO;
DROP TABLE USUARIO;

/* 17. Crear Tabla : ...................... CREATE TABLE __ ( __ , __ )                  */

create table USUARIO(
usuario_id int not null auto_increment,
usuario_primer_nombre varchar(45) not null,
usuario_segundo_nombre varchar(45) not null,
usuario_primer_apellido varchar(45) not null,
usuario_segundo_apellido varchar(45) not null,
usuario_documento int not null,
usuario_correo varchar(45) not null,
usuario_direccion varchar(45) not null,
usuario_credencial varchar(45) not null,
primary key(usuario_id)
);

/* 18. Renombrar Tabla : .................. RENAME TABLE __ TO __                        */

RENAME TABLE USUARIO TO USUARIOS;
RENAME TABLE PLAN_FUNEBRE TO PLAN;
RENAME TABLE ROL TO ROLES;
RENAME TABLE CONTRATO TO CONTRATOS;

/* 19. Crear Llave Primaria : ............. ALTER TABLE __ ADD PRIMARY KEY ( __ )        */

ALTER TABLE ROL_USUARIO ADD PRIMARY KEY (cred_id);

/* 20. Crear Índice Campo : ............... CREATE INDEX __ ON __ ( __ )                 */

CREATE INDEX ind_usuario_rol_id ON ROL_USUARIO (cred_id);

/* 21. Crear Índice Multicampo : .......... CREATE INDEX _ ON _ ( __ , __ )              */

CREATE INDEX ind_rol_id_estado_cred ON ROL_USUARIO(rol_id,estado_cred);

/* 22. Crear Índice Único : ............... CREATE UNIQUE INDEX __ ON __ ( __ )          */

CREATE UNIQUE INDEX ind_usuario_correo ON  USUARIOS (usuario_correo);

/* 23. Crear Restricción : ................ ALTER TABLE __ ADD CONSTRAINT __             */
/*     FOREIGN KEY ( __ ) REFERENCES __ ( __ ) ON DELETE CASCADE ON UPDATE CASCADE       */

ALTER TABLE USUARIOS ADD CONSTRAINT fk_usuario_rol 
foreign key(rol_id)
references ROL(rol_id)
ON DELETE CASCADE 
ON UPDATE CASCADE;

