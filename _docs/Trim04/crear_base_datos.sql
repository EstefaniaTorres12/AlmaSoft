DROP database BBDD_FUNERARIA_ALMASOFT;
CREATE SCHEMA BBDD_FUNERARIA_ALMASOFT DEFAULT CHARACTER SET utf8 ;
USE BBDD_FUNERARIA_ALMASOFT;

CREATE TABLE ROL (
rol_id INT NOT NULL auto_increment,
rol_nombre varchar(45) not null,
primary key (rol_id)
) engine=InnoDB;

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
)engine=InnoDB;

CREATE TABLE ROL_USUARIO(
cred_id int not null auto_increment,
rol_id int not null,
usuario_id int not null,
estado_cred boolean not null,
primary key(cred_id),

constraint fk_rol_id
foreign key(rol_id)
references ROL(rol_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
constraint fk_usuario_id
foreign key(usuario_id)
references USUARIO(usuario_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine= InnoDB;

CREATE TABLE TELEFONO(
telefono int not null,
usuario_id int not null,

constraint fk_usuario_telefono
foreign key(usuario_id)
references USUARIO(usuario_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE CLIENTE(
cliente_id int not null,
cliente_fecha_nacimiento date not null,
cliente_edad int not null,

constraint fk_usuario_cliente
foreign key(cliente_id)
references USUARIO(usuario_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE CONTRATO(
contrato_id int not null auto_increment,
contrato_estado boolean not null,
contrato_valor double not null,
cliente_id int not null,
primary key(contrato_id),

constraint fk_cliente_contrato
foreign key(cliente_id)
references CLIENTE(cliente_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE AFILIADO(
afiliado_id int not null,
contrato_id int not null,

constraint fk_usuario_afiliado
foreign key (afiliado_id)
references USUARIO(usuario_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
constraint fk_contrato_afiliado
foreign key(contraTo_id)
references CONTRATO(contrato_id)
on delete cascade
on update cascade
)engine=InnoDB;

CREATE TABLE CATEGORIA(
categoria_id int not null auto_increment,
categoria_nombre varchar(45) not null,
primary key(categoria_id)
)engine=InnoDB;

CREATE TABLE SUBCATEGORIA(
subcategoria_id int not null auto_increment,
subcategoria_nombre varchar(45) not null,
categoria_id int not null,
primary key(subcategoria_id),

constraint fk_categoria_sub
foreign key(categoria_id)
references CATEGORIA(categoria_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE PRODUCTO (
producto_id int not null auto_increment,
producto_nombre varchar(45) not null,
producto_descripcion varchar(50) not null,
producto_precio double not null,
producto_stock int not null,
producto_estado boolean not null,
subcategoria_id int not null,
primary key(producto_id),

constraint fk_subc_producto
foreign key(subcategoria_id)
references SUBCATEGORIA(subcategoria_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE CONTRATO_PRODUCTO(
contrato_id int not null,
producto_id int not null,

constraint fk_contrato_producto
foreign key(contrato_id)
references CONTRATO(contrato_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
constraint fk_producto_contrato
foreign key(producto_id)
references PRODUCTO(producto_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE SERVICIO(
servicio_id int not null auto_increment,
servicio_nombre varchar(45),
servicio_descripcion varchar(45),
servicio_precio double not null,
primary key(servicio_id)
)engine=InnoDB;

CREATE TABLE PLAN_FUNEBRE(
plan_id int not null auto_increment,
plan_nombre varchar(45) not null,
plan_precio double not null,
plan_estado boolean not null,
primary key(plan_id)
)engine=InnoDB;

CREATE TABLE SERVICIO_PLAN(
servicio_id int not null,
plan_id int not null,

constraint fk_servicio_plan
foreign key(servicio_id)
references SERVICIO(servicio_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
constraint fk_plan_servicio
foreign key(plan_id)
references PLAN_FUNEBRE(plan_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE CONTRATO_PLAN(
contrato_id int not null,
plan_id int not null,

constraint fk_contrato_plan
foreign key(contrato_id)
references CONTRATO(contrato_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
constraint fk_plan_contrato
foreign key(plan_id)
references PLAN_FUNEBRE(plan_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;

CREATE TABLE PAGO(
pago_id int not null auto_increment,
pago_metodo varchar(45) not null,
pago_fecha date not null,
contrato_id int not null,
primary key(pago_id),

constraint fk_contrato_pago
foreign key(contrato_id)
references CONTRATO(contrato_id)
ON DELETE CASCADE
ON UPDATE CASCADE
)engine=InnoDB;
